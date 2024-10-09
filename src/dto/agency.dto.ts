import { IsEmail, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import mongoose from "mongoose";
import { GENDER } from "src/schema/user.schema";

export class AgencyUserDto {
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
    companyName: string;

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
