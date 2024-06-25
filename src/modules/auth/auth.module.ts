import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserModule } from '@modules/user/user.module';

@Module({
  imports: [UserModule, JwtModule],
  providers: [AuthService]
})
export class AuthModule {}
