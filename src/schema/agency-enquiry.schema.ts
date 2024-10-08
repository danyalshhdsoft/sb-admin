import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Role } from './role.schema';
import { ADMIN_ACCOUNT_STATUS } from 'src/enums/admin.account.status.enum';

export type AdminDocument = HydratedDocument<AgencyEnquiry>;
@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
})
export class AgencyEnquiry extends Document {
  @Prop({
    required: true,
    type: String,
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
    unique: true,
  })
  firstName: string;

  @Prop({
    type: String,
  })
  lastName: string;

  @Prop({
    type: String,
  })
  password: string;

  @Prop({
    default: false,
    type: String,
  })
  companyName: string;

  @Prop({
    default: ADMIN_ACCOUNT_STATUS.ACTIVE,
    enum: ADMIN_ACCOUNT_STATUS,
    type: String,
  })
  status: string;

  @Prop({
    default: null,
    type: mongoose.Schema.Types.ObjectId,
    ref: Role.name,
  })
  role: Role;

  @Prop({ default: null, type: Date })
  deletedAt: Date;
}

export const AgencyEnquirySchema = SchemaFactory.createForClass(AgencyEnquiry);
