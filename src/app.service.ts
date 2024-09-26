import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GetUserRequest } from './get-user-request.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import mongoose, { Model } from 'mongoose';
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
//import { EmailService } from './email/email.service';

@Injectable()
export class AppService {

  constructor(
    private jwtService: JwtService,
    private verificationCodeService: OtpTokensService,
    @InjectModel(User.name) private adminModel: Model<Admin>,
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

  getUser(getUserRequest: GetUserRequest) {
    return this.users.find((user) => user.userId === getUserRequest.userId);
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
    return new ApiResponse({
      accessToken,
      admin: adminInfo
    }, 200);
  }

  async register(user: RegisterUserDto) {
    const existingAdmin = await this.adminModel.findOne({
      email: user.email,
    });
    if (existingAdmin) {
      throw new RpcException(
        `Admin with email ${existingAdmin.email} already exists`,
      );
    }
    const hashPass = await this.hashPassword(user.password);
    await this.adminModel.create({
      ...user,
      password: hashPass
    });

    return new ApiResponse({message: "User Created Successfully"}, 201);
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
    return {
      status: 201,
      data: role
    };
  }

  async updateRole(isIdDto: mongoose.Types.ObjectId, updateRoleDTO: any) {
    const role = await this.adminRole.findByIdAndUpdate(
      isIdDto.id,
      updateRoleDTO,
      { new: true },
    );
    return {
      status: 200,
      data: role
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
