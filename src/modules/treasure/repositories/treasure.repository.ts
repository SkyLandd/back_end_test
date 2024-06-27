import { TreasureEntity } from "@database/entities/treasure.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, In, Repository } from "typeorm";
import { TreasureType } from "../enums/treasure-type.enum";

@Injectable()
export class TreasureRepository {
  constructor(
    @InjectRepository(TreasureEntity)
    private treasureRepo: Repository<TreasureEntity>
  ) { }

  public async findOneBy(filter: { id: string }) {
    return this.treasureRepo.findOne({ where: { id: filter.id } })
  }

  public async findBulkBy(filter: { types?: TreasureType[], ids?: string[] }) {
    const whereOptions: FindOptionsWhere<TreasureEntity> = {}

    if (filter.types?.length) {
      whereOptions.type = In(filter.types);
    }

    if (filter.ids?.length) {
      whereOptions.id = In(filter.ids);
    }

    return this.treasureRepo.find({ where: whereOptions });
  }

  public async save(treasures: TreasureEntity[]) {
    return this.treasureRepo.save(treasures);
  }
}