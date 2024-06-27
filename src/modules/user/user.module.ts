import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@database/entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UserMapper } from './user.mapper';
import { UserInventoryRepository } from './repositories/user-inventory.repository';
import { UserInventoryEntity } from '@database/entities/user-inventory.entity';
import { TradeEntity } from '@database/entities/trade.entity';
import { TradeRepository } from './repositories/trade.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserInventoryEntity, TradeEntity])],
  controllers: [],
  providers: [UserRepository, UserService, UserMapper, UserInventoryRepository, TradeRepository],
  exports: [UserService]
})
export class UserModule {}
