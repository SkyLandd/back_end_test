import { Inject, Injectable } from "@nestjs/common";
import { UserInventoryRepository } from "../repositories/user-inventory.repository";
import { IGrantPayload } from "@common/interfaces/IGrantPayload";
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";

@Injectable()
export class LeaderboardService {
  constructor(
    private userInventoryRepository: UserInventoryRepository,
    @Inject(CACHE_MANAGER)
    private cache: Cache
  ) { }

  private getCacheKey() {
    return `LEADERBOARD`
  }

  public async generateLeaderboard() {
    return this.userInventoryRepository.rankByCount()
  }

  public async getLeaderboard(user: IGrantPayload) {
    const cacheKey = this.getCacheKey()
    const leaderboard = await this.cache.get(cacheKey);

    if (leaderboard) return leaderboard;

    return this.update();
  }

  public async update() {
    const cacheKey = this.getCacheKey()
    await this.cache.del(cacheKey);

    const leaderboard = await this.generateLeaderboard();
    await this.cache.set(cacheKey, leaderboard);

    return leaderboard;
  }

  public async deleteCache() {
    const cacheKey = this.getCacheKey()
    await this.cache.del(cacheKey);
  }
}