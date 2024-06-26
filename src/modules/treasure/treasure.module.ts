import { Module } from '@nestjs/common';
import { TreasureService } from './treasure.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TreasureEntity } from '@database/entities/treasure.entity';
import { TreasureRepository } from './repository/treasure.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TreasureEntity])],
  providers: [TreasureService, TreasureRepository],
  exports: [TreasureService]
})
export class TreasureModule {}
