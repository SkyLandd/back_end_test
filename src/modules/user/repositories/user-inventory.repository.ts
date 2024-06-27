import { UserInventoryEntity } from "@database/entities/user-inventory.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, FindOptionsWhere, Repository } from "typeorm";
import { InventoryStatus } from "../enums/inventory-status.enum";

@Injectable()
export class UserInventoryRepository {
  constructor(
    @InjectRepository(UserInventoryEntity)
    private userInventoryRepo: Repository<UserInventoryEntity>,
  ) { }

  public getManager() {
    return this.userInventoryRepo.manager;
  }

  public getRepo(transactionManager?: EntityManager) {
    return transactionManager ? transactionManager.getRepository(UserInventoryEntity) : this.userInventoryRepo;
  }

  public async saveTreasure(userInventoryEntity: UserInventoryEntity, transactionManager: EntityManager) {
    return this.getRepo(transactionManager).save(userInventoryEntity);
  }

  public async findInventoryBy(filter: { 
    id: string, userId: string
  }, transactionManager?: EntityManager) {
    const findWhereOptions: FindOptionsWhere<UserInventoryEntity> = { }
    findWhereOptions.id = filter.id;
    findWhereOptions.userId = filter.userId;

    return this.getRepo(transactionManager).findOne({ where: findWhereOptions });
  }

  public async updateInventoryStatus(
    id: string, 
    status: InventoryStatus,
    transactionManager: EntityManager
  ) {
    return this.getRepo(transactionManager).save({ id, status });
  }
}