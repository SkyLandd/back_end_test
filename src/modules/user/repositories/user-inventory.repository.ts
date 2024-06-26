import { UserInventoryEntity } from "@database/entities/user-inventory.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";

@Injectable()
export class UserInventoryRepository {
  constructor(
    @InjectRepository(UserInventoryEntity)
    private userInventoryRepo: Repository<UserInventoryEntity>
  ) { }

  public getManager() {
    return this.userInventoryRepo.manager;
  }

  public async saveTreasure(userInventoryEntity: UserInventoryEntity, transactionManager: EntityManager) {
    const repo = transactionManager.getRepository(UserInventoryEntity);
    return repo.save(userInventoryEntity);
  }
}