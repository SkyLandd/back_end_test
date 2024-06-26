import * as argon2 from 'argon2';
import ms, { StringValue } from 'ms';
import { IUser, LoginUserDto, RegisterUserDto } from '@common/dtos/user.dto';
import { UserService } from '@modules/user/services/user.service';
import { BadRequestException, ConflictException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from '@database/entities/user.entity';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnknownException } from '@common/exceptions/Unknown.exception';
import { GrantType } from '../constants/grant-type.constant';
import { IGrantPayload } from '@common/interfaces/IGrantPayload';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER)
    private cache: Cache
  ) { }

  private getLogContext(method: string) {
    return `AuthService - ${method}`
  }

  private getGrantCacheKey(grantType: GrantType, payload: IGrantPayload) {
    return `${payload.id}:${grantType}`
  }

  public async register(registerDto: RegisterUserDto) {
    const logContext = this.getLogContext('register')
    try {
      registerDto.password = await this.hashPassword(registerDto.password);
      const registeredUser = await this.userService.register(registerDto);
      Logger.log(`User registered with id ${registeredUser.id}`, logContext);
      return this.handleAuthResponse(registeredUser);
    } catch (err) {
      Logger.error(`Error while registering user ${JSON.stringify(registerDto)} with error ${err} - ${JSON.stringify(err?.response)}`, logContext);

      if (err instanceof ConflictException) {
        throw err;
      }

      throw new UnknownException();
    }
  }

  public async login(loginDto: LoginUserDto) {
    const logContext = this.getLogContext('login');
    try {
      const existingUser = await this.userService.getOneOrThrow({ email: loginDto.email }, true) as UserEntity;
      const isValidPassword = await this.verifyPassword(loginDto.password, existingUser.password);
      if (!isValidPassword) {
        throw new BadRequestException(`Invalid email or password`)
      }

      // Securing it again by removing password
      delete existingUser.password
      return this.handleAuthResponse(existingUser);
    } catch (err) {
      Logger.error(`Error while login for email ${loginDto.email} with error ${err} - ${JSON.stringify(err?.response)}`, logContext);

      if (err instanceof NotFoundException || err instanceof BadRequestException) {
        throw new BadRequestException(`Invalid email or password`)
      }

      throw new UnknownException();
    }
  }

  private async hashPassword(password: string) {
    return argon2.hash(password);
  }

  private async verifyPassword(password: string, hashedPassword: string) {
    return argon2.verify(hashedPassword, password);
  }

  private async handleAuthResponse(user: IUser) {
    const accessToken = await this.generateToken(GrantType.ACCESS, user);
    const refreshToken = await this.generateToken(GrantType.REFRESH, user);

    return {
      accessToken,
      refreshToken
    }
  }

  private async generateToken(grantType: GrantType, user: IUser | IGrantPayload) {
    const grantPayload: IGrantPayload = {
      id: user.id,
      email: user.email,
      handle: user.handle
    }

    const jwtSignOptions = this.getJwtOptions(grantType);
    const token = this.jwtService.sign(grantPayload, jwtSignOptions);
    await this.cache.set(this.getGrantCacheKey(grantType, user), token, ms(`${jwtSignOptions.expiresIn}` as StringValue));
    return token;
  }

  private getJwtOptions(grantType: GrantType) {
    const jwtSignOptions: JwtSignOptions = {};
    switch (grantType) {
      case GrantType.ACCESS:
        jwtSignOptions.secret = this.configService.getOrThrow(
          'ACCESS_TOKEN_SECRET',
        );
        jwtSignOptions.expiresIn = this.configService.getOrThrow(
          'ACCESS_TOKEN_EXPIRY',
        );
        break;
      case GrantType.REFRESH:
        jwtSignOptions.secret = this.configService.getOrThrow(
          'REFRESH_TOKEN_SECRET',
        );
        jwtSignOptions.expiresIn = this.configService.getOrThrow(
          'REFRESH_TOKEN_EXPIRY',
        );
        break;
      case GrantType.EMAIL_VERIFICATION:
        jwtSignOptions.secret = this.configService.getOrThrow(
          'EMAIL_VERIFICATION_TOKEN_SECRET',
        );
        jwtSignOptions.expiresIn = this.configService.getOrThrow(
          'EMAIL_VERIFICATION_TOKEN_EXPIRY',
        );
        break;
      default:
        throw new InternalServerErrorException(
          'InvalidGrantType: ' + grantType,
        );
    }
    return jwtSignOptions;
  }

  public async validateGrantToken(grantType: GrantType, token: string, payload: IGrantPayload) {
    const logContext = this.getLogContext(`validateGrantToken - ${payload.id}`);
    try {
      const cacheKey = this.getGrantCacheKey(grantType, payload);
      const storedToken = await this.cache.get(cacheKey);

      if (storedToken !== token) {
        throw new UnauthorizedException();
      }

      return payload;
    } catch (err) {
      Logger.error(`Error while validating grant verification ${err} - ${JSON.stringify(err?.response ?? {})}`, logContext);
      if (err instanceof UnauthorizedException)
        throw err;

      throw new UnknownException();
    }
  }

  public sendVerificationEmail(user: IGrantPayload) {
    const logContext = this.getLogContext(`sendVerificationEmail - ${user.id}`);
    try {
      // Intentionally not handling duplicate verification
      const emailVerificationToken = this.generateToken(GrantType.EMAIL_VERIFICATION, user);
      return emailVerificationToken;
    } catch (err) {
      Logger.error(`Error while sending verification email ${err} - ${JSON.stringify(err?.response ?? {})}`, logContext);
      throw new UnknownException();
    }
  }

  public async verifyEmail(user: IGrantPayload, token: string) {
    const logContext = this.getLogContext(`verifyEmail - ${user.id}`);

    try {
      const storedToken = await this.cache.get(this.getGrantCacheKey(GrantType.EMAIL_VERIFICATION, user));

      if (storedToken !== token) {
        throw new UnauthorizedException(`Verification failed`);
      }
      await this.userService.updateEmailVerified(user);
    } catch (err) {
      Logger.error(`Error while verifying email ${err} - ${JSON.stringify(err?.response ?? {})}`, logContext);
      
      if (err instanceof UnauthorizedException) {
        throw err;
      }

      throw new UnknownException();
    }
  }
} 
