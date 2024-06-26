import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@database/entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UserMapper } from './user.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [],
  providers: [UserRepository, UserService, UserMapper],
  exports: [UserService]
})
export class UserModule {}
