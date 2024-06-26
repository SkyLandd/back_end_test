import { hash } from 'argon2';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from '@modules/user/service/user.service';
import { IUser, LoginUserDto, RegisterUserDto } from '@common/dtos/user.dto';
import { BadRequestException, ConflictException, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from '@database/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { CustomCacheModule } from '@modules/cache/cache.module';
import { GrantType } from './auth.constants';
import { IGrantPayload } from '@common/interfaces/IGrantPayload';

describe('AuthService', () => {
  let service: AuthService;
  let userServiceMock: UserService;
  let cacheMock: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), JwtModule, CustomCacheModule],
      providers: [AuthService],
    })
    .useMocker((token) => {
      if (token === UserService) {
        return {
          register: jest.fn,
          getOneOrThrow: jest.fn,
          updateEmailVerified: jest.fn
        }
      }
      if (token === CACHE_MANAGER) {
        return {
          get: jest.fn,
          set: jest.fn
        }
      }
    })
    .compile();

    service = module.get<AuthService>(AuthService);
    userServiceMock = module.get<UserService>(UserService);
    cacheMock = module.get<Cache>(Cache);
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
  });

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
  });

  describe('validateGrantToken', () => {
    it('throw unauthorized if cached tokens don\'t match', async () => {
      jest.spyOn(cacheMock, 'get').mockResolvedValue('differenttoken');
      const payload = { id: 'id', email: 'email@email.com', handle: 'uniquehandle' }
      let response: IGrantPayload;
      let exception: any;

      try {
        response = await service.validateGrantToken(
          GrantType.ACCESS, 
          'expectedtoken', 
          payload
        )
      } catch(err) {
        exception = err;
      }
      
      expect(response).not.toBeDefined();
      expect(exception).toBeDefined();
      expect(exception).toBeInstanceOf(UnauthorizedException);
    })

    it('return payload as response if tokens match', async () => {
      jest.spyOn(cacheMock, 'get').mockResolvedValue('expectedtoken');
      const payload = { id: 'id', email: 'email@email.com', handle: 'uniquehandle' }
      let response: IGrantPayload;
      let exception: any;

      try {
        response = await service.validateGrantToken(
          GrantType.ACCESS, 
          'expectedtoken', 
          payload
        )
      } catch(err) {
        exception = err;
      }
      
      expect(response).toBeDefined();
      expect(exception).not.toBeDefined();
    })

    it('throw internal server exception if something unknown happens', async () => {
      jest.spyOn(cacheMock, 'get').mockRejectedValue(new Error());
      const payload = { id: 'id', email: 'email@email.com', handle: 'uniquehandle' }
      let response: IGrantPayload;
      let exception: any;

      try {
        response = await service.validateGrantToken(
          GrantType.ACCESS, 
          'expectedtoken', 
          payload
        )
      } catch(err) {
        exception = err;
      }
      
      expect(response).not.toBeDefined();
      expect(exception).toBeDefined();
      expect(exception).toBeInstanceOf(InternalServerErrorException);
    })
  })

  describe('sendVerificationEmail', () => {
    it('save token in cache', async () => {
      const cacheSpy = jest.spyOn(cacheMock, 'set');
      const payload = { id: 'id', email: 'email@email.com', handle: 'uniquehandle' }
      
      await service.sendVerificationEmail(payload);

      expect(cacheSpy).toHaveBeenCalled();
    })
  })

  describe('verifyEmail', () => {
    it('throw unauthorized if cached tokens don\'t match', async () => {
      jest.spyOn(cacheMock, 'get').mockResolvedValue('differenttoken');
      const payload = { id: 'id', email: 'email@email.com', handle: 'uniquehandle' }
      let exception: any;

      try {
        await service.verifyEmail(
          payload,
          'expectedtoken'
        )
      } catch(err) {
        exception = err;
      }
      
      expect(exception).toBeDefined();
      expect(exception).toBeInstanceOf(UnauthorizedException);
    })

    it('should not throw unauthorized excpetion if cached tokens match', async () => {
      jest.spyOn(cacheMock, 'get').mockResolvedValue('expectedtoken');
      jest.spyOn(userServiceMock, 'updateEmailVerified').mockResolvedValue();

      const payload = { id: 'id', email: 'email@email.com', handle: 'uniquehandle' }
      let exception: any;

      try {
        await service.verifyEmail(
          payload,
          'expectedtoken'
        )
      } catch(err) {
        exception = err;
      }
      
      expect(exception).not.toBeDefined();
    })

    it('call updateEmailVerified if tokens match', async () => {
      jest.spyOn(cacheMock, 'get').mockResolvedValue('expectedtoken');
      jest.spyOn(userServiceMock, 'updateEmailVerified').mockResolvedValue();

      const payload = { id: 'id', email: 'email@email.com', handle: 'uniquehandle' }
      let exception: any;

      try {
        await service.verifyEmail(
          payload,
          'expectedtoken'
        )
      } catch(err) {
        exception = err;
      }
      
      expect(userServiceMock.updateEmailVerified).toHaveBeenCalled();
    })
  })
});
