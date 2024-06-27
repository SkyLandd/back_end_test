import { UserInventoryEntity } from "@database/entities/user-inventory.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, FindOptionsWhere, IsNull, MoreThanOrEqual, Not, Repository } from "typeorm";
import { InventoryStatus } from "../enums/inventory-status.enum";
import { UserEntity } from "@database/entities/user.entity";

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

  public async saveTreasure(userInventoryEntity: UserInventoryEntity[], transactionManager: EntityManager) {
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

  public async findBulkInventory(filter: { 
    userId: string,
    self?: boolean
  }, transactionManager?: EntityManager) {
    const findWhereOptions: FindOptionsWhere<UserInventoryEntity> = { }
    if (filter.self) {
      findWhereOptions.userId = filter.userId;
    } else {
      findWhereOptions.userId = Not(filter.userId);
    }

    findWhereOptions.inventoryStatus = InventoryStatus.COLLECTED;

    return this.getRepo(transactionManager).find({ where: findWhereOptions });
  }

  public async updateInventoryStatus(
    id: string, 
    status: InventoryStatus,
    transactionManager: EntityManager
  ) {
    return this.getRepo(transactionManager).save({ id, inventoryStatus: status });
  }

  public async countInventoryByStatus(userId: string): Promise<{ status: InventoryStatus, count: number }[]> {
    const alias = 'userInventory';
    const qb = this.getRepo().createQueryBuilder(alias);
    qb.select(`${alias}.status`, 'status')
      .addSelect(`COUNT(${alias}.id)`, 'count')
      .where(`${alias}.userId = :userId`, { userId })
      .groupBy(`${alias}.status`)
    
    return qb.getRawMany();
  }

  public async countInventoryByDate(userId: string, fromDate: Date) {
    return this.getRepo().count({ where: { 
      userId,
      createdAt: MoreThanOrEqual(fromDate),
      sessionId: Not(IsNull())
    } })
  }

  public async rankByCount(): Promise<{ userHandle: string, count: number }[]> {
    const alias = 'userInventory';
    const userAlias = 'user';
    const qb = this.getRepo().createQueryBuilder(alias);
    qb.select(`${userAlias}.handle`, 'userHandle')
      .addSelect(`COUNT(${alias}.id)`, 'count')
      .where(`${alias}.inventoryStatus = :inventoryStatus`, { inventoryStatus: InventoryStatus.COLLECTED })
      .leftJoin(UserEntity, userAlias, `CAST(${userAlias}.id AS varchar) = ${alias}.user_id`)
      .groupBy(`${userAlias}.handle`)
      .orderBy(`COUNT(${alias}.id)`, 'DESC')
    
    return qb.getRawMany();
  }
}