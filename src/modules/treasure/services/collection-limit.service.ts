import * as moment from 'moment-timezone';
import { TreasureSettingType } from "@modules/treasure/enums/treasure-setting-type.enum";
import { TreasureService } from "@modules/treasure/services/treasure.service";
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { Inject, Injectable, Logger, UnprocessableEntityException } from "@nestjs/common";

@Injectable()
export class CollectionLimitService {
  constructor(
    private treasureService: TreasureService,
    @Inject(CACHE_MANAGER)
    private cache: Cache
  ) { }

  private getLogContext(name: string) {
    return `CollectionLimitService - ${name}`
  }

  private getCacheKey(userId: string) {
    return `DAILY_COLLECTION:${userId}`
  }

  public async allowedTreasureCollection(userId: string) {
    const collectionLimitSettings = await this.treasureService.findBulkSettingBy({
      types: [TreasureSettingType.WEEKLY_LIMIT, TreasureSettingType.DAILY_LIMIT]
    });

    const cacheKey = this.getCacheKey(userId);
    const currentWeekDates = this.getCurrentWeekDates();
    let weekCount = 0;
    let dayCount = 0;
    for(let date of currentWeekDates) {
      const count: number = (await this.cache.get(`${cacheKey}:${date}`)) || 0;
      if (moment().isSame(date, 'date')) {
        dayCount = count;
      }
      weekCount += count;
    }
    
    for (let setting of collectionLimitSettings) {
      const limit = Number(setting.value);
      if (setting.type === TreasureSettingType.WEEKLY_LIMIT) {
        if (weekCount >= limit) {
          Logger.error(`Weekly limit reached for user ${userId}`);
          throw new UnprocessableEntityException(`Weekly limit reached`);
        }
      } else if (setting.type === TreasureSettingType.DAILY_LIMIT) {
        if (dayCount >= limit) {
          Logger.error(`Daily limit reached for user ${userId}`);
          throw new UnprocessableEntityException(`Daily limit reached`);
        }
      }
    }
  }

  public async updateCollected(userId: string) {
    const cacheKey = this.getCacheKey(userId);
    const date = moment().format('YYYY-MM-DD');
    const endOfWeek = moment().endOf('week');
    const ttlInMinutes = endOfWeek.diff(moment(), 'minute');
    //To avoid any precision problems calculate in mins and convert to ms
    const ttlInMs = ttlInMinutes * 60 * 1000;

    const count: number = (await this.cache.get(`${cacheKey}:${date}`)) || 0;

    // Key will automatically expire after the week
    await this.cache.set(`${cacheKey}:${date}`, count + 1, ttlInMs);
  }

  private getCurrentWeekDates() {
    let dates: string[] = [];
    let startOfWeek = moment().startOf('week'); // Start of the current week
    for (let i = 0; i < 7; i++) {
      dates.push(startOfWeek.clone().add(i, 'days').format('YYYY-MM-DD'));
    }
    return dates;
  }
}