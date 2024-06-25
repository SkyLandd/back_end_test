import * as argon2 from 'argon2';
import { RegisterUserDto } from '@common/dtos/user.dto';
import { UserService } from '@modules/user/service/user.service';
import { ConflictException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService
  ) { }

  private getLogContext(method: string) {
    return `AuthService - ${method}`
  }

  private async hashPassword(password: string) {
    return argon2.hash(password);
  }

  private async verifyPassword(password: string, hashedPassword: string) {
    return argon2.verify(hashedPassword, password);
  }

  public async register(registerDto: RegisterUserDto) {
    const logContext = this.getLogContext('register')
    try {
      registerDto.password = await this.hashPassword(registerDto.password);
      const registeredUser = await this.userService.register(registerDto);
      Logger.log(`User registered with id ${registeredUser.id}`, logContext)
      return registeredUser;
    } catch (err) {
      Logger.error(`Error while registering user ${JSON.stringify(registerDto)} with error ${err} - ${JSON.stringify(err?.response)}`, logContext);

      if (err instanceof ConflictException) {
        throw err;
      }
      throw new InternalServerErrorException(`Error occured while registering user. Try again after sometime!`);
    }
  }
}
