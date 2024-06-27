import { Module } from '@nestjs/common';
import { TreasureService } from './services/treasure.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TreasureEntity } from '@database/entities/treasure.entity';
import { TreasureRepository } from './repositories/treasure.repository';
import { TreasureSettingEntity } from '@database/entities/treasure-setting.entity';
import { TreasureSettingRepository } from './repositories/treasure-setting.repository';
import { CollectionLimitService } from './services/collection-limit.service';
import { CustomCacheModule } from '@modules/cache/cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([TreasureEntity, TreasureSettingEntity]), CustomCacheModule],
  providers: [TreasureService, TreasureRepository, TreasureSettingRepository, CollectionLimitService],
  exports: [TreasureService, CollectionLimitService]
})
export class TreasureModule {}
