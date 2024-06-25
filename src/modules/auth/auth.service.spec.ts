import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '@modules/user/service/user.service';
import { IUser, RegisterUserDto } from '@common/dtos/user.dto';
import { UserModule } from '@modules/user/user.module';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userServiceMock: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    })
    .useMocker((token) => {
      if (token === UserService) {
        return {
          register: jest.fn   
        }
      }
    })
    .compile();

    service = module.get<AuthService>(AuthService);
    userServiceMock = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    let registerUserDto: RegisterUserDto;
    let user: IUser;

    beforeEach(() => {
      registerUserDto = new RegisterUserDto();
      registerUserDto.email = 'email';
      registerUserDto.password = 'password';
      registerUserDto.handle = 'handle';

      user = {
        email: 'email',
        emailVerified: false,
        handle: 'handle',
        id: 'id'
      }
    })

    it('successfully register a user', async () => {
      jest.spyOn(userServiceMock, 'register').mockResolvedValue(user);

      const responseUser = await service.register(registerUserDto);
      expect(responseUser).toBeDefined();
    })

    it('throws ConflictException as per user service', async () => {
      jest.spyOn(userServiceMock, 'register').mockRejectedValue(new ConflictException());
      
      let responseUser: IUser;
      let exception: any;
      try {
        responseUser = await service.register(registerUserDto);
      } catch(err) {
        exception = err;
      }

      expect(responseUser).not.toBeDefined();
      expect(exception).toBeDefined();
      expect(exception).toBeInstanceOf(ConflictException);
    })

    it('throws InternalServiceException if something unknown happens', async () => {
      let responseUser: IUser;
      let exception: any;
      try {
        responseUser = await service.register({ ...registerUserDto, password: undefined });
      } catch(err) {
        exception = err;
      }

      expect(responseUser).not.toBeDefined();
      expect(exception).toBeDefined();
      expect(exception).toBeInstanceOf(InternalServerErrorException);
    })
  })

  describe('login', () => {

  })
});
