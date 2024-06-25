import * as argon2 from 'argon2';
import { IUser, LoginUserDto, RegisterUserDto } from '@common/dtos/user.dto';
import { UserService } from '@modules/user/service/user.service';
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { UserEntity } from '@database/entities/user.entity';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnknownException } from '@common/exceptions/Unknown.exception';
import { GrantType } from './auth.constants';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) { }

  private getLogContext(method: string) {
    return `AuthService - ${method}`
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

  private handleAuthResponse(user: IUser) {
    const accessToken = this.generateToken(GrantType.ACCESS, user);
    const refreshToken = this.generateToken(GrantType.REFRESH, user);

    return {
      accessToken,
      refreshToken
    }
  }

  private generateToken(grantType: GrantType, user: IUser) {
    const grantPayload = {
      id: user.id,
      email: user.email,
      handle: user.handle
    }

    const jwtSignOptions = this.getJwtOptions(grantType);
    return this.jwtService.sign(grantPayload, jwtSignOptions);
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
}
