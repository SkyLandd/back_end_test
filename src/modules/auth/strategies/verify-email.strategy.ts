import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { GrantType } from '../constants/grant-type.constant';
import { IGrantPayload } from '@common/interfaces/IGrantPayload';

@Injectable()
export class VerifyEmailStrategy extends PassportStrategy(Strategy, 'verify-email') {
  constructor(
    readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      secretOrKey: configService.getOrThrow<string>('EMAIL_VERIFICATION_TOKEN_SECRET'),
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
      passReqToCallback: true,
      ignoreExpiration: false,
    } as StrategyOptions);
  }

  async validate(req: Request, grantPayload: IGrantPayload) {
    const emailVerificationToken = ExtractJwt.fromUrlQueryParameter('token')(req);
    return this.authService.validateGrantToken(
      GrantType.EMAIL_VERIFICATION,
      emailVerificationToken,
      grantPayload,
    );
  }
}
