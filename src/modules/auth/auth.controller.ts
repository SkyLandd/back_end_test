import { LoginUserDto, RegisterUserDto } from '@common/dtos/user.dto';
import { Body, Controller, Post, Query, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from './guards/jwt.guard';
import { IGrantPayload } from '@common/interfaces/IGrantPayload';
import { User } from './decorators/grant-payload.decorator';
import { TOKEN_NAME } from '@common/constants/auth';
import { VerifyEmailGuard } from './guards/verify-email.guard';

@Controller('auth')
@ApiTags("Auth")
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

  @Post('/verify-email/send')
  @ApiSecurity(TOKEN_NAME)
  @UseGuards(JwtGuard)
  public async sendVerificationEmail(
    @User() user: IGrantPayload
  ) {
    return this.authService.sendVerificationEmail(user);
  }

  @Post('/verify-email')
  @UseGuards(VerifyEmailGuard)
  public async verifyEmail(
    @Query('token') token: string,
    @User() user: IGrantPayload
  ) {
    return this.authService.verifyEmail(user, token);
  }
}
