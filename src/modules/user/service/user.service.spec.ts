import { randomUUID } from 'crypto'
import { hash } from 'argon2';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { IUser, RegisterUserDto } from '@common/dtos/user.dto';
import { UserRepository } from '../repository/user.repository';
import { UserMapper } from '../user.mapper';
import { UserEntity } from '@database/entities/user.entity';
import { BadRequestException, ConflictException, Logger, NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let mockUserRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, UserMapper],
    })
    .useMocker((token) => {
      if (token === UserRepository) {
        return {
          findOneBy: jest.fn,
          saveOne: jest.fn,
          exists: jest.fn
        }
      }
    })
    .compile();

    service = module.get<UserService>(UserService);
    mockUserRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    let registerUserDto: RegisterUserDto;
    let userEntity: UserEntity;

    beforeEach(async () => {
      registerUserDto = {
        email: 'iamemail@email.com',
        handle: 'handle',
        password: await hash('randomhashedpassword')
      }

      userEntity = new UserEntity();
      userEntity.email = registerUserDto.email;
      userEntity.handle = registerUserDto.handle;
      userEntity.password = registerUserDto.password;
      userEntity.emailVerified = false;
      userEntity.id = randomUUID();
    })

    it('Register a user successfully', async () => {
      jest.spyOn(mockUserRepository, 'exists').mockResolvedValue(false)
      jest.spyOn(mockUserRepository, 'saveOne').mockResolvedValue(userEntity)
  
      const savedUser = await service.register(registerUserDto);
      expect(mockUserRepository.saveOne).toHaveBeenCalled();
      expect(savedUser.id).toBeDefined();
    });

    it('Throws conflict exception if user exists already', async () => {
      jest.spyOn(mockUserRepository, 'exists').mockResolvedValue(true);

      let savedUser: IUser;
      let error: any;

      try {
        savedUser = await service.register(registerUserDto);
      } catch(err) {
        error = err;
      }

      expect(savedUser).not.toBeDefined();
      expect(error).toBeInstanceOf(ConflictException);
    });

    it('Registering a user should not return password in response', async () => {
      jest.spyOn(mockUserRepository, 'exists').mockResolvedValue(false)
      jest.spyOn(mockUserRepository, 'saveOne').mockResolvedValue(userEntity)
  
      const savedUser = await service.register(registerUserDto);
      expect(mockUserRepository.saveOne).toHaveBeenCalled();
      expect(savedUser).toBeDefined();
      expect(savedUser).not.toHaveProperty('password');
    });

    it('Throws bad request exception if password is not hashed', async () => {
      jest.spyOn(mockUserRepository, 'exists').mockResolvedValue(false);

      let savedUser: IUser;
      let error: any;

      try {
        const insecureDetails = { ...registerUserDto };
        insecureDetails.password = 'abcde';
        savedUser = await service.register(insecureDetails);
      } catch(err) {
        error = err;
      }

      expect(savedUser).not.toBeDefined();
      expect(error).toBeInstanceOf(BadRequestException);
    })
  })

  describe('getOneOrThrow', () => {
    let registerUserDto: RegisterUserDto;
    let userEntity: UserEntity;

    beforeEach(async () => {
      registerUserDto = {
        email: 'iamemail@email.com',
        handle: 'handle',
        password: await hash('randomhashedpassword')
      }

      userEntity = new UserEntity();
      userEntity.email = registerUserDto.email;
      userEntity.handle = registerUserDto.handle;
      userEntity.password = registerUserDto.password;
      userEntity.emailVerified = false;
      userEntity.id = randomUUID();
    })

    it('Throw not found exception if user not found', async () => {
      jest.spyOn(mockUserRepository, 'findOneBy').mockResolvedValue(undefined)
  
      let savedUser: IUser;
      let exception: any;

      try {
        savedUser = await service.getOneOrThrow({ email: registerUserDto.email });
      } catch(err) {
        exception = err;
      }

      expect(mockUserRepository.findOneBy).toHaveBeenCalled();
      expect(exception).toBeInstanceOf(NotFoundException);
    });

    it('Throw not found exception if user not found', async () => {
      jest.spyOn(mockUserRepository, 'findOneBy').mockResolvedValue(userEntity)
  
      let savedUser: IUser;
      let exception: any;

      try {
        savedUser = await service.getOneOrThrow({ email: registerUserDto.email });
      } catch(err) {
        exception = err;
      }

      expect(mockUserRepository.findOneBy).toHaveBeenCalled();
      expect(exception).not.toBeDefined();
      expect(savedUser).toBeDefined();
    });

    it('returns user with password if withPassword is true', async () => {
      jest.spyOn(mockUserRepository, 'findOneBy').mockResolvedValue(userEntity)
  
      let savedUser: IUser;
      let exception: any;

      try {
        savedUser = await service.getOneOrThrow({ email: registerUserDto.email }, true);
      } catch(err) {
        exception = err;
      }

      expect(mockUserRepository.findOneBy).toHaveBeenCalled();
      expect(exception).not.toBeDefined();
      expect(savedUser).toBeDefined();
      expect(savedUser).toHaveProperty('password');
    });

    it('returns user with password if withPassword is not set', async () => {
      jest.spyOn(mockUserRepository, 'findOneBy').mockResolvedValue(userEntity)
  
      let savedUser: IUser;
      let exception: any;

      try {
        savedUser = await service.getOneOrThrow({ email: registerUserDto.email });
      } catch(err) {
        exception = err;
      }

      expect(mockUserRepository.findOneBy).toHaveBeenCalled();
      expect(exception).not.toBeDefined();
      expect(savedUser).toBeDefined();
      expect(savedUser).not.toHaveProperty('password');
    });
  })
});
