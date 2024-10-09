import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Role } from './role.schema';
import { ADMIN_ACCOUNT_STATUS } from 'src/enums/admin.account.status.enum';

export type AdminDocument = HydratedDocument<Admin>;
@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
})
export class Admin extends Document {
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
  username: string;

  @Prop({
    type: String,
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
    type: Boolean,
  })
  isSuperAdmin: boolean;

  @Prop({
    default: ADMIN_ACCOUNT_STATUS.ACTIVE,
    enum: ADMIN_ACCOUNT_STATUS,
    type: String,
  })
  status: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Role', default: null })
  role: mongoose.Types.ObjectId;

  @Prop({ default: null, type: Date })
  deletedAt: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

AdminSchema.virtual('fullName').get(function (this: {
  firstName: string;
  lastName: string;
}): string {
  return `${this.firstName} ${this.lastName}`;
});

AdminSchema.pre<AdminDocument>('save', async function (next) {
  // password hash
  if (this.password) this.password = await bcrypt.hash(this.password, 10);

  if (!this.username) {
    let username = this.email.split('@')[0];
    let isUnique = false;
    while (!isUnique) {
      const existingUser = await this.model('User').findOne({ username });
      if (!existingUser) {
        isUnique = true;
      } else {
        username += `_${Math.floor(1000 + Math.random() * 9000)}`;
      }
    }
    this.username = username;
  }
  next();
});
