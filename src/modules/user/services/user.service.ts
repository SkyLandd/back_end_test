import { IUser, RegisterUserDto } from '@common/dtos/user.dto';
import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserMapper } from '../user.mapper';
import { UserEntity } from '@database/entities/user.entity';
import { IGrantPayload } from '@common/interfaces/IGrantPayload';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private userMapper: UserMapper,
  ) {}

  private getLogContext(name: string) {
    return `UserService - ${name}`
  }

  private isHashed(password: string) {
    return password.match(/^\$argon2/g)
  }

  private async exists(
    registerUserDto: RegisterUserDto
  ): Promise<boolean> {
    return this.userRepository.exists(registerUserDto);
  }

  /**
   * Registers a new User
   * 
   * @param registerUserDto 
   * @returns IUser
   * @throws ConflictException if user email, handle exists
   * @throws BadRequestException if password is not secure to be stored i.e not hashed (Expects caller to call it securely)
   */
  public async register(
    registerUserDto: RegisterUserDto
  ): Promise<IUser> {
    let logContext = this.getLogContext(`register`);
    const userExists = await this.exists(registerUserDto);
    if (userExists) {
      throw new ConflictException(`User email or handle already exists`);
    }

    if (!this.isHashed(registerUserDto.password)) {
      throw new BadRequestException(`Insecure password in request`);
    }

    const userEntity = this.userMapper.toEntity(registerUserDto);
    const savedUser = await this.userRepository.saveOne(userEntity);
    return this.userMapper.toUser(savedUser);
  }

  /**
   * Find and returns a user with given id or email
   * 
   * @param filter 
   * @returns IUser
   * @throws NotFoundException if user with passed param does not exist
   */
  public async getOneOrThrow(filter: { id?: string, email?: string }, withPassword?: boolean): Promise<IUser | UserEntity> {
    const user = await this.userRepository.findOneBy(filter);
    if (!user) {
      throw new NotFoundException(`User with details not found`);
    }

    return withPassword ? user : this.userMapper.toUser(user);
  }

  public async updateEmailVerified(user: IGrantPayload) {
    const userToUpdate = new UserEntity();
    userToUpdate.id = user.id;
    userToUpdate.emailVerified = true;
    await this.userRepository.saveOne(userToUpdate);
  }
}
