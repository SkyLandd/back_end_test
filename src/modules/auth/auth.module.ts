import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserModule } from '@modules/user/user.module';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, UserModule, JwtModule],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
