import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { GrantType } from '../auth.constants';
import { IGrantPayload } from '@common/interfaces/IGrantPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      secretOrKey: configService.getOrThrow<string>('ACCESS_TOKEN_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
      ignoreExpiration: false,
    } as StrategyOptions);
  }

  async validate(req: Request, grantPayload: IGrantPayload) {
    const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    return this.authService.validateGrantToken(
      GrantType.ACCESS,
      accessToken,
      grantPayload,
    );
  }
}
