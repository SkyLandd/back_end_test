import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserModule } from '@modules/user/user.module';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { CustomCacheModule } from '@modules/cache/cache.module';
import { VerifyEmailStrategy } from './strategies/verify-email.strategy';

@Module({
  imports: [ConfigModule, UserModule, JwtModule, CustomCacheModule],
  providers: [AuthService, JwtStrategy, VerifyEmailStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
