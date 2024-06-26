import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@database/entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UserMapper } from './user.mapper';
import { UserInventoryRepository } from './repositories/user-inventory.repository';
import { UserInventoryEntity } from '@database/entities/user-inventory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserInventoryEntity])],
  controllers: [],
  providers: [UserRepository, UserService, UserMapper, UserInventoryRepository],
  exports: [UserService]
})
export class UserModule {}
