import * as moment from "moment-timezone";
import { Inject, Injectable } from "@nestjs/common";
import { UserInventoryRepository } from "../repositories/user-inventory.repository";
import { IGrantPayload } from "@common/interfaces/IGrantPayload";
import { InventoryStatus } from "../enums/inventory-status.enum";
import { IUserStatistics } from "../interfaces/user-statistics.interface";
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";

@Injectable()
export class UserStatisticsService {
  constructor(
    private userInventoryRepository: UserInventoryRepository,
    @Inject(CACHE_MANAGER)
    private cache: Cache
  ) { }

  private getCacheKey(user: IGrantPayload) {
    return `STATISTICS:${user.id}`
  }

  private async generateStatistics(user: IGrantPayload) {
    const statistics: IUserStatistics = {
      totalActiveTrades: 0,
      totalCollectedTreasures: 0,
      totalTradedTreasures: 0,
      todaysGameTreasureCollection: 0,
      weeksGameTreasureCollection: 0,
    }

    const inventoryStatusCount = await this.userInventoryRepository.countInventoryByStatus(user.id);
    for(let statusCount of inventoryStatusCount) {
      if (statusCount.status === InventoryStatus.COLLECTED) {
        statistics.totalCollectedTreasures = Number(statusCount.count);
      } else if (statusCount.status === InventoryStatus.TRADED) {
        statistics.totalTradedTreasures = Number(statusCount.count);
      } else if (statusCount.status === InventoryStatus.ACTIVE_TRADE) {
        statistics.totalActiveTrades = Number(statusCount.count);
      }
    }

    statistics.todaysGameTreasureCollection = await this.getCurrentDayCount(user);
    statistics.weeksGameTreasureCollection = await this.getCurrentWeekCount(user);

    return statistics;
  }

  public async deleteCache(user: IGrantPayload) {
    const cacheKey = this.getCacheKey(user);
    await this.cache.del(cacheKey);
  }

  public async updateStatistics(user: IGrantPayload) {
    // Delete existing statistics
    const cacheKey = this.getCacheKey(user);
    await this.cache.del(cacheKey);

    const statistics = await this.generateStatistics(user);
    await this.cache.set(cacheKey, statistics);
    return statistics;
  }

  public async getStatistics(user: IGrantPayload) {
    const cacheKey = this.getCacheKey(user);
    const statistics = await this.cache.get(cacheKey);

    if (statistics) return statistics;

    return this.updateStatistics(user);
  }

  private async getCurrentDayCount(user: IGrantPayload) {
    const today = moment().startOf('day')
    return this.userInventoryRepository.countInventoryByDate(user.id, today.toDate());
  }

  private async getCurrentWeekCount(user: IGrantPayload) {
    const startOfWeek = moment().startOf('week')
    return this.userInventoryRepository.countInventoryByDate(user.id, startOfWeek.toDate());
  }


}