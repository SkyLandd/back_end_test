import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { ormConfig } from '@config/orm.config';
import { UserEntity } from '@database/entities/user.entity';
import { RegisterUserDto } from '@common/dtos/user.dto';
import { UserRepository } from './user.repository';

describe('UserRepository', () => {
  let repository: UserRepository;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          ...ormConfig,
          entities: [UserEntity]
        }),
        TypeOrmModule.forFeature([UserEntity])
      ],
      providers: [UserRepository],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
  });

  afterEach(async () => {
    // Clean up the database after each test
    await module.get(getRepositoryToken(UserEntity)).clear();
  });

  afterAll(async () => {
    // Close the database connection after all tests
    await module.close();
  });

  it('repository be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findOneBy', () => {
    let userEntity: UserEntity;
    let savedUser: UserEntity;

    beforeEach(async () => {
      userEntity = new UserEntity();
      userEntity.email = 'email@email.com';
      userEntity.handle = 'unique';
      userEntity.password = 'jasjasjhsajhassaghhjgsafgsag';
      savedUser = await repository.saveOne(userEntity);
    })

    it('find user by id successfully', async () => {
      const foundUser = await repository.findOneBy({ id: savedUser.id })

      expect(foundUser).toBeDefined()
      expect(foundUser).toBeInstanceOf(UserEntity);
      expect(foundUser.id).toBe(savedUser.id);
      expect(foundUser.email).toBe(userEntity.email);
      expect(foundUser.handle).toBe(userEntity.handle);
    })

    it('find user by email successfully', async () => {
      const foundUser = await repository.findOneBy({ email: userEntity.email })

      expect(foundUser).toBeDefined()
      expect(foundUser).toBeInstanceOf(UserEntity);
      expect(foundUser.id).toBe(savedUser.id);
    })

    it('find user by handle successfully', async () => {
      const foundUser = await repository.findOneBy({ handle: userEntity.handle })

      expect(foundUser).toBeDefined()
      expect(foundUser).toBeInstanceOf(UserEntity);
      expect(foundUser.id).toBe(savedUser.id);
    })
  })

  describe('exists', () => {
    let userEntity: UserEntity;
    let registerDto: RegisterUserDto;

    beforeEach(async () => {
      userEntity = new UserEntity();
      userEntity.email = 'email@email.com';
      userEntity.handle = 'unique';
      userEntity.password = 'jasjasjhsajhassaghhjgsafgsag';
      await repository.saveOne(userEntity);

      registerDto = new RegisterUserDto()
    })

    it('check same email exists', async () => {
      registerDto.email = userEntity.email;
      registerDto.handle = 'different';
      const exists = await repository.exists(registerDto)

      expect(exists).toBe(true)
    })

    it('check same handle exists', async () => {
      registerDto.email = 'different@email.com';
      registerDto.handle = userEntity.handle;
      const exists = await repository.exists(registerDto)

      expect(exists).toBe(true)
    })

    it('check when handle and email does not exists', async () => {
      registerDto.email = 'different@email.com';
      registerDto.handle = 'different';
      const exists = await repository.exists(registerDto)

      expect(exists).toBe(false)
    })
  })
});