import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/schema/user.schema';

export enum OTP_TOKEN_TYPES {
  EMAIL_VERIFICATION = 'email-verification',
  RESET_PASSWORD = 'reset-password',
}

@Schema({ timestamps: true })
export class OtpTokens {
  @Prop({ required: true })
  code: string;

  @Prop({ default: false })
  isUsed: boolean;

  @Prop({
    type: String,
    enum: Object.values(OTP_TOKEN_TYPES),
    required: true,
  })
  type: string;

  @Prop({ type: Date, default: Date.now, expires: 86400 }) // expires in 5 minutes
  expiresAt: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User;
}

export const OtpTokensSchema = SchemaFactory.createForClass(OtpTokens);
