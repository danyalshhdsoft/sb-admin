import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export enum USER_TYPES {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum GENDER {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

class License {
  @Prop()
  authority: string;

  @Prop()
  number: number;
}

class Agent {
  
  @Prop()
  experience: number;

  @Prop()
  description: string;

  @Prop()
  serviceArea: mongoose.Types.ObjectId;

  @Prop()
  developerId: mongoose.Types.ObjectId;

  @Prop()
  license: License[];
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({
    required: true,
    type: String,
    unique: true,
  })
  email: string;
  @Prop({
    default: USER_TYPES.USER,
    enum: USER_TYPES,
  })
  userType: string;

  @Prop()
  firstName: string;

  @Prop()
  accessToken: string;

  @Prop({
    enum: GENDER,
  })
  gender: string;

  @Prop()
  fullName: string;

  @Prop()
  lastName: string;

//   @Prop({
//     enum: LANGUAGE
//   })
//   language: string;

//   @Prop({
//     enum: USER_STATUS
//   })
//   status: string;

  @Prop()
  password: string;
  @Prop({
    default: false,
  })
  emailVerified: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Country' })
  country?: mongoose.Types.ObjectId;

//   @Prop({
//     default: null,
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'role',
//   })
//   role?: Role;

  @Prop()
  phone: number;

  @Prop()
  whatsapp: number;

  @Prop()
  profilePicUrl: string;

  @Prop()
  agent: Agent;
}

export const UserSchema = SchemaFactory.createForClass(User);
