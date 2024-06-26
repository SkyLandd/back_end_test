import { Module } from '@nestjs/common';
import { TreasureService } from './services/treasure.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TreasureEntity } from '@database/entities/treasure.entity';
import { TreasureRepository } from './repositories/treasure.repository';
import { TreasureSettingEntity } from '@database/entities/treasure-setting.entity';
import { TreasureSettingRepository } from './repositories/treasure-setting.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TreasureEntity, TreasureSettingEntity])],
  providers: [TreasureService, TreasureRepository, TreasureSettingRepository],
  exports: [TreasureService]
})
export class TreasureModule {}
