import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import mongoose from 'mongoose';

enum GENDER {
    MALE = "MALE",
    FEMALE = "FEMALE",
}

export class RegisterUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  profilePicUrl: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  whatsAppPhone: string;

  @IsEnum(GENDER)
  @IsNotEmpty()
  gender: GENDER;

  @IsMongoId()
  @IsNotEmpty()
  country: mongoose.Types.ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  roleType: mongoose.Types.ObjectId;

  @IsString()
  @IsOptional()
  agentDescription: string;

  @IsMongoId()
  @IsOptional()
  developerId: mongoose.Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  serviceArea: mongoose.Types.ObjectId;
}
export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class ResetPasswordRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @Validate((value, args) => value === args.object.password)
  confirmPassword: string;
}

export class VerifyEmailDto {
  @IsString()
  @IsNotEmpty()
  otp: string;
}
