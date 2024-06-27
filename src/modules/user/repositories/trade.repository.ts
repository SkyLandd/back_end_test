import { TradeEntity } from "@database/entities/trade.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, FindOptionsWhere, Repository } from "typeorm";
import { TradeStatus } from "../enums/trade-status.enum";

@Injectable()
export class TradeRepository {
  constructor(
    @InjectRepository(TradeEntity)
    private tradeRepo: Repository<TradeEntity>,
  ) {}

  public getManager() {
    return this.tradeRepo.manager;
  }

  public getRepo(transactionManager?: EntityManager) {
    return transactionManager ? transactionManager.getRepository(TradeEntity) : this.tradeRepo;
  }

  public async save(tradeEntity: TradeEntity, transactionManager: EntityManager) {
    return this.getRepo(transactionManager).save(tradeEntity);
  }

  public async findTradeBy(filter: { initiatorUserId?: string, recepientUserId?: string, status?: TradeStatus }) {
    const whereOptions: FindOptionsWhere<TradeEntity> = { }

    if (filter.initiatorUserId) {
      whereOptions.initiatorUserId = filter.initiatorUserId;
    }

    if (filter.recepientUserId) {
      whereOptions.recepientUserId = filter.recepientUserId;
    }

    if (filter.status) {
      whereOptions.status = filter.status;
    }

    return this.getRepo().find({ where: whereOptions });
  }
}