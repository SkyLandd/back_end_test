import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import { GameCoordinatesDto, IStoredTreasure } from "../dtos/treasure-collect.dto";
import { TreasureEntity } from "@database/entities/treasure.entity";

@Injectable()
export class TreasureDistributionService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cache: Cache
  ) { }

  private getLogContext(name: string) {
    return `TreasureDistributionService - ${name}`
  }

  private getCacheKey(treasureId: string, sessionId: string) {
    return `TREASURE:${sessionId}:${treasureId}`
  }

  private getRandomCoordinatesNearPoint(position: GameCoordinatesDto, radiusInMetre: number) {
    const metresPerDegreeLat = 111320;
    const radiusInDegrees = radiusInMetre/metresPerDegreeLat;

    const randomAngle = Math.random() * Math.PI * 2;
    const randomDistance = Math.random() * radiusInDegrees;

    const deltaLat = randomDistance * Math.cos(randomAngle);
    const deltaLong = randomDistance * Math.sin(randomAngle) / Math.cos(parseFloat(position.lat) * Math.PI / 180);

    const randomCoordinates = new GameCoordinatesDto();
    randomCoordinates.lat = (parseFloat(position.lat) + deltaLat).toFixed(6);
    randomCoordinates.long = (parseFloat(position.long) + deltaLong).toFixed(6);

    return randomCoordinates;
  }

  public async distributeTreasures(treasures: TreasureEntity[], sessionId: string) {
    // Hardcoding the position - Should be loaded from the map configuration
    const centrePosition = new GameCoordinatesDto();
    centrePosition.lat = `40.712776`;
    centrePosition.long = `-74.005974`;
    const radiusInMetre = 20000; // 20 km
    const treasureTTL = 10*60*1000; // 10 mins

    const sessionTreasures = [];
    for(let treasure of treasures) {
      const randomPosition = this.getRandomCoordinatesNearPoint(centrePosition, radiusInMetre);
      const cacheKey = this.getCacheKey(treasure.id, sessionId);
      const storedTreasure: IStoredTreasure = {
        treasure, position: randomPosition
      }
      sessionTreasures.push(storedTreasure);
      await this.cache.set(cacheKey, storedTreasure, treasureTTL);
    }

    return sessionTreasures;
  }

  public async isValidTreasure(treasureId: string, sessionId: string, position: GameCoordinatesDto) {
    const logContext = this.getLogContext(`isValidTreasure`);
    const cacheKey = this.getCacheKey(treasureId, sessionId);
    const storedTreasure: IStoredTreasure = await this.cache.get(cacheKey);
    
    const isValid = (
      storedTreasure && 
      storedTreasure.position.lat === position.lat && 
      storedTreasure.position.long === position.long
    );

    if (!isValid) {
      Logger.error(`MANIPULATION: Trying to collect treasure which does not exist ${treasureId} ${sessionId}`, logContext)
      throw new BadRequestException(`Manipulation: Trying to collect treasure which does not exist`);
    }
  }

  public async removeTreasure(treasureId: string, sessionId: string,) {
    const cacheKey = this.getCacheKey(treasureId, sessionId);
    await this.cache.del(cacheKey);
  }
}