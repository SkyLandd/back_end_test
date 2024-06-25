import { hash } from 'argon2';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from '@modules/user/service/user.service';
import { IUser, LoginUserDto, RegisterUserDto } from '@common/dtos/user.dto';
import { BadRequestException, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UserEntity } from '@database/entities/user.entity';
import { ConfigModule } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;
  let userServiceMock: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), JwtModule],
      providers: [AuthService],
    })
    .useMocker((token) => {
      if (token === UserService) {
        return {
          register: jest.fn,
          getOneOrThrow: jest.fn,
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
      
      let tokens: any;
      let exception: any;
      try {
        tokens = await service.register(registerUserDto);
      } catch(err) {
        exception = err;
      }

      expect(tokens).not.toBeDefined();
      expect(exception).toBeDefined();
      expect(exception).toBeInstanceOf(ConflictException);
    })

    it('throws InternalServiceException if something unknown happens', async () => {
      let tokens: any;
      let exception: any;
      try {
        tokens = await service.register({ ...registerUserDto, password: undefined });
      } catch(err) {
        exception = err;
      }

      expect(tokens).not.toBeDefined();
      expect(exception).toBeDefined();
      expect(exception).toBeInstanceOf(InternalServerErrorException);
    })
  })

  describe('login', () => {
    let loginUserDto: LoginUserDto;
    let user: UserEntity;

    beforeEach(async () => {
      loginUserDto = new LoginUserDto();
      loginUserDto.email = 'email@email.com';
      loginUserDto.password = 'password';

      user = new UserEntity();
      user.id = 'id';
      user.email = loginUserDto.email;
      user.password = await hash(loginUserDto.password);
    })

    it('throws bad request exception if email is not found', async () => {
      jest.spyOn(userServiceMock, 'getOneOrThrow').mockRejectedValue(new NotFoundException());
      let tokens: any;
      let exception: any;
      try {
        tokens = await service.login(loginUserDto);
      } catch(err) {
        exception = err;
      }

      expect(tokens).not.toBeDefined();
      expect(exception).toBeDefined();
      expect(exception).toBeInstanceOf(BadRequestException);
    })

    it('throws bad request exception if passwords don\'t match', async () => {
      jest.spyOn(userServiceMock, 'getOneOrThrow').mockResolvedValue(user);
      let tokens: any;
      let exception: any;
      try {
        tokens = await service.login({ ...loginUserDto, password: 'randomstr' });
      } catch(err) {
        exception = err;
      }

      expect(tokens).not.toBeDefined();
      expect(exception).toBeDefined();
      expect(exception).toBeInstanceOf(BadRequestException);
    })

    it('throws internal server exception if some unknown error occurs', async () => {
      jest.spyOn(userServiceMock, 'getOneOrThrow').mockResolvedValue(user);
      let tokens: any;
      let exception: any;
      try {
        tokens = await service.login({ ...loginUserDto, password: undefined });
      } catch(err) {
        exception = err;
      }

      expect(tokens).not.toBeDefined();
      expect(exception).toBeDefined();
      expect(exception).toBeInstanceOf(InternalServerErrorException);
    })

    it('returns valid tokens on successful login', async () => {
      jest.spyOn(userServiceMock, 'getOneOrThrow').mockResolvedValue(user);
      let tokens: { accessToken: string, refreshToken: string };
      let exception: any;
      try {
        tokens = await service.login(loginUserDto);
      } catch(err) {
        exception = err;
      }

      expect(exception).not.toBeDefined();
      expect(tokens).toBeDefined();
      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();
    })
  })
});
