import { Module } from '@nestjs/common';
import { TreasureService } from './services/treasure.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TreasureEntity } from '@database/entities/treasure.entity';
import { TreasureRepository } from './repositories/treasure.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TreasureEntity])],
  providers: [TreasureService, TreasureRepository],
  exports: [TreasureService]
})
export class TreasureModule {}
