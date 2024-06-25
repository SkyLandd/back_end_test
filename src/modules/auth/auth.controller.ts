import { LoginUserDto, RegisterUserDto } from '@common/dtos/user.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) { }

  @Post('/register')
  public async register(
    @Body() registerDto: RegisterUserDto
  ) {
    return this.authService.register(registerDto);
  }

  @Post('/login')
  public async login(
    @Body() loginDto: LoginUserDto
  ) {
    return this.authService.login(loginDto);
  }
}
