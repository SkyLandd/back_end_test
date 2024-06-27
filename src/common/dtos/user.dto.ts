import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsStrongPassword } from "class-validator";

export interface IUser {
  id: string;
  handle: string;
  email: string;
  emailVerified: boolean;
}

export class LoginUserDto {
  @IsEmail()
  @ApiProperty({ example: 'user@email.com' })
  email: string;

  @IsStrongPassword({ minLength: 6, minLowercase: 1, minNumbers: 1, minSymbols: 1, minUppercase: 1 }, {
    message: 'Password is not strong (It should be atleast 6 in length and contain 1 lowercase, 1 number, 1 uppercase, and 1 symbol)'
  })
  @ApiProperty({ example: 'u1U@12' })
  password: string;
}

export class RegisterUserDto extends LoginUserDto {
  @IsString()
  @ApiProperty({ example: 'uniquehandle' })
  handle: string;
}