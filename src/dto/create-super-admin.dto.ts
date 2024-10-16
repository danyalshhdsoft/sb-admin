import {
    IsBoolean,
    IsEmail,
    IsEnum,
    IsMongoId,
    IsNotEmpty,
    IsOptional,
    IsString,
    Validate,
  } from 'class-validator';
  import mongoose from 'mongoose';

export class CreateSuperAdminDto {
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
  
    @IsBoolean()
    @IsNotEmpty()
    isSuperAdmin: boolean;
  }