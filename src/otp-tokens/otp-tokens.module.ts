import { Module } from '@nestjs/common';
import { OtpTokensService } from './otp-tokens.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schema/user.schema';
import { OtpTokens, OtpTokensSchema } from 'src/schema/otp-tokens.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OtpTokens.name, schema: OtpTokensSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [OtpTokensService, OtpTokens],
  exports: [OtpTokensService],
})
export class OtpTokensModule {}
