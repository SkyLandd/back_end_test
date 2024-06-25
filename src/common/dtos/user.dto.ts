import { IsEmail, IsString, IsStrongPassword } from "class-validator";

export interface IUser {
  id: string;
  handle: string;
  email: string;
  emailVerified: boolean;
}

export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsStrongPassword({ minLength: 6, minLowercase: 1, minNumbers: 1, minSymbols: 1, minUppercase: 1 })
  password: string;
}

export class RegisterUserDto extends LoginUserDto {
  @IsString()
  handle: string;
}