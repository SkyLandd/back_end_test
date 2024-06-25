import { IUser, RegisterUserDto } from "@common/dtos/user.dto";
import { UserEntity } from "@database/entities/user.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserMapper {
  constructor() { }

  public toEntity(registerDto: RegisterUserDto) {
    const userEntity = new UserEntity();

    userEntity.email = registerDto.email;
    userEntity.handle = registerDto.handle;
    userEntity.password = registerDto.password;

    return userEntity;
  }

  public toUser(userEntity: UserEntity) {
    const user: IUser = {
      email: userEntity.email,
      emailVerified: userEntity.emailVerified,
      handle: userEntity.handle,
      id: userEntity.id
    };

    return user;
  }
}