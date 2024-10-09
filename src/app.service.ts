import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GetUserRequest } from './get-user-request.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import mongoose, { Model, Mongoose, Schema, Types } from 'mongoose';
import { User } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterUserDto } from './dto/auth.dto';
import { OTP_TOKEN_TYPES } from './schema/otp-tokens.schema';
import { OtpTokensService } from './otp-tokens/otp-tokens.service';
import { RpcException } from '@nestjs/microservices';
import { Admin } from './schema/admin.schema';
import { ConfigService } from '@nestjs/config';
import { AdminJWTPayload } from './interface/admin-jwt-payload';
import { JWT_SECRET_ADMIN } from './utils/constants';
import { AdminBinding } from './dto/admin.binding';
import { Role } from './schema/role.schema';
import ApiResponse from './utils/api-response-utils';
import { aggregatePaginate } from './utils/pagination.service';
import { AgencyEnquiry } from './schema/agency-enquiry.schema';
import { AgencyUserDto } from './dto/agency.dto';
import { Agency } from './schema/agency.schema';
import { AGENCY_OWNER, constructAgencyOwnerRole } from './utils/common';
import { ADMIN_ACCOUNT_STATUS } from './enums/admin.account.status.enum';
//import { EmailService } from './email/email.service';

@Injectable()
export class AppService {

  constructor(
    private jwtService: JwtService,
    private verificationCodeService: OtpTokensService,
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    @InjectModel(Agency.name) private agencyModel: Model<Agency>,
    @InjectModel(AgencyEnquiry.name) private agencyEnquiryModel: Model<AgencyEnquiry>,
    private readonly configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Role.name) private adminRole: Model<Role>,
  ) { }

  private readonly users: any[] = [
    {
      userId: '123',
      stripeUserId: '43234',
    },
    {
      userId: '345',
      stripeUserId: '27279',
    },
  ];

  getHello(): string {
    return 'Hello World!';
  }

  async getUser(getUserRequest: GetUserRequest) {
    return await this.adminModel.findOne({_id: getUserRequest.userId});
  }

  async signin(user: any) {
    const admin: Admin = await this.findByEmail(
      user.email,
    );
    
    if (!admin) {
      return new ApiResponse({message: "Admin not found"}, 400)
    }

    const matchPassword = await this.comparePassword(
      admin,
      user.password,
    );
    
    if (!matchPassword) {
      return new ApiResponse({message: "Incorrect Password"}, 400);
    }
    const payload: AdminJWTPayload = {
      id: String(admin._id),
      username: admin.username,
      fullname: admin.firstName + ' ' + admin.lastName,
      email: admin.email,
      role: String(admin.role),
    };
    const secret = this.configService.get<string>(JWT_SECRET_ADMIN);
    const accessToken = await this.jwtService.signAsync(payload, { secret });
    const adminInfo = new AdminBinding(admin);

    return {
      status: 200,
      data: {
        data: {
          accessToken,
          admin: adminInfo
        }
      }
    }
  }

  async registerQuery(user: RegisterUserDto) {

    const existingAgencyEnquiry = await this.agencyEnquiryModel.findOne({
      email: user.email,
    });
    if (existingAgencyEnquiry) {
      return {
        status: 500,
        data: {
          message: `Agency with email ${existingAgencyEnquiry.email} already exists`
        }
      }
    }
    const hashPass = await this.hashPassword(user.password);
    await this.agencyEnquiryModel.create({
      ...user,
      password: hashPass
    });

    return {
      status: 201,
      data: {
        message: "Enquiry Submitted Succesfully"
      }
    }
  }

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  generateJwt(payload) {
    return this.jwtService.sign(payload, {
      expiresIn: '24h',
    });
  }

  async findUserByEmail(email) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      return null;
    }

    return user;
  }

  getUserBasicData(user: User) {
    return {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      onboardingStep: this.getUserOnboardingStep(user),
    };
  }

  getUserOnboardingStep(user: User) {
    if (!user.emailVerified) return 'email-verification';
    return 'dashboard';
  }

  async findByEmail(email: string) {
    const admin: Admin = await this.adminModel.findOne({ email: email });
    return admin;
  }

  async comparePassword(
    admin: Admin,
    candidatePassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, admin.password);
  }

  async createRole(
    name: string,
    permissions: any
  ) {
    const role = await this.adminRole.create({ name, permissions });
    return new ApiResponse(role, 201);
  }

  async updateRole(isIdDto: mongoose.Types.ObjectId, updateRoleDTO: any) {
    const role = await this.adminRole.findByIdAndUpdate(
      isIdDto,
      updateRoleDTO,
      { new: true },
    );
    return {
      status: 200,
      data: role
    };
  }

  async getRoles(page: string, limit: string) {
    const roles = await aggregatePaginate(
      this.adminRole,
      [],
      Number(page),
      Number(limit),
    );
    return {
      status: 200,
      data: roles
    }
  }

  async createAgency(agency: AgencyUserDto) {
    try {
      const password = await this.hashPassword(agency.password);
      const owner = {
        email: agency.email,
        username: agency.email,
        firstName: agency.firstName,
        lastName: agency.lastName,
        password,
        isSuperAdmin: false,
        status: ADMIN_ACCOUNT_STATUS.ACTIVE,
        role: new mongoose.Types.ObjectId(AGENCY_OWNER)
      };
      
      await this.adminModel.create(owner);
      await this.agencyModel.create(agency);  
    }
    catch(err) {
      return {
        status: 400,
        data: {
          message: err.message
        } 
      }
    }
    
    return {
      status: 200,
      data: {
        message: "Agency created"
      }
    };
  }

  // async createAdmin(adminSignUpDto: AdminSignupDto) {
  //   const existingAdmin = await this.adminModel.findOne({
  //     email: adminSignUpDto.email,
  //   });
  //   if (existingAdmin) {
  //     throw new BadRequestException(
  //       `Admin with email ${existingAdmin.email} already exists`,
  //     );
  //   }
  //   return await this.adminModel.create(adminSignUpDto);
  // }
}
