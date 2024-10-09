import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Role } from './role.schema';
import { ADMIN_ACCOUNT_STATUS } from 'src/enums/admin.account.status.enum';

export type AgencyDocument = HydratedDocument<Agency>;
@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
})
export class Agency extends Document {
  @Prop({
    required: true,
    type: String,
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
  })
  name: string;

  @Prop({
    default: ADMIN_ACCOUNT_STATUS.ACTIVE,
    enum: ADMIN_ACCOUNT_STATUS,
    type: String,
  })
  status: string;

  @Prop({ default: null, type: Date })
  deletedAt: Date;
}

export const AgencySchema = SchemaFactory.createForClass(Agency);
