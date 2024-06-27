import { TreasureSettingEntity } from "@database/entities/treasure-setting.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, In, Repository } from "typeorm";
import { TreasureSettingType } from "../enums/treasure-setting-type.enum";


@Injectable()
export class TreasureSettingRepository {
  constructor(
    @InjectRepository(TreasureSettingEntity)
    private treasureSettingRepo: Repository<TreasureSettingEntity>
  ) { }

  public async findOneBy(filter: { id?: string, type?: TreasureSettingType }) {
    const whereOptions: FindOptionsWhere<TreasureSettingEntity> = {}
    if (filter.id) {
      whereOptions.id = filter.id;
    } else if(filter.type) {
      whereOptions.type = filter.type;
    }

    return this.treasureSettingRepo.findOne({ where: whereOptions });
  }

  public async findBulkBy(filter: { types?: TreasureSettingType[], ids?: string[] }) {
    const whereOptions: FindOptionsWhere<TreasureSettingEntity> = {}

    if (filter.types?.length) {
      whereOptions.type = In(filter.types);
    } else if (filter.ids?.length) {
      whereOptions.id = In(filter.ids);
    }

    return this.treasureSettingRepo.find({ where: whereOptions });
  }

  public async save(treasureSettings: TreasureSettingEntity[]) {
    return this.treasureSettingRepo.save(treasureSettings);
  }
}