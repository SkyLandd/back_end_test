import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import { GameCoordinatesDto, IStoredPosition } from "../dtos/treasure-collect.dto";

@Injectable()
export class UserLocationService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cache: Cache
  ) { }

  private getLogContext(name: string) {
    return `UserLocationService - ${name}`
  }

  private getCacheKey(userId: string, sessionId: string) {
    return `POSITION:${sessionId}:${userId}`;
  }

  private calculateHaversineDistance(currentPosition: GameCoordinatesDto, lastPosition: GameCoordinatesDto) {
    const asRadians = (degree: number) => degree * Math.PI / 180;
    const universeRadiusInMetre = 6371e3; // Considering universe is earth in game

    const currentLat = parseFloat(currentPosition.lat);
    const currentLong = parseFloat(currentPosition.long);
    const prevLat = parseFloat(lastPosition.lat);
    const prevLong = parseFloat(lastPosition.long);

    const startLatInRadians = asRadians(prevLat);
    const endLatInRadians = asRadians(currentLat);
    const latDiff = asRadians(currentLat - prevLat);
    const longDiff = asRadians(currentLong - prevLong);

    const a = Math.sin(latDiff / 2) * Math.sin(latDiff / 2) + Math.cos(startLatInRadians) * Math.cos(endLatInRadians) * Math.sin(longDiff / 2) * Math.sin(longDiff / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return universeRadiusInMetre * c; //In Metres
  }

  private isPossibleDistanceJump(lastCollectedPosition: IStoredPosition, currentPosition: GameCoordinatesDto) {
    // Hardcoding the speed - Should be loaded from the map configuration
    const permissibleSpeedInMetrePerSecond = 5;
    const elapsedTimeInMs = new Date().valueOf() - lastCollectedPosition.timestamp;
    
    const possibleDistance = permissibleSpeedInMetrePerSecond * (elapsedTimeInMs/1000)
    const distanceTraveled = this.calculateHaversineDistance(currentPosition, lastCollectedPosition.position);

    return distanceTraveled <= possibleDistance;
  }

  /**
   * Check if the user is switching position very soon - This is very common in games which shows bot behaviour
   */
  public async isValidLocation(userId: string, sessionId: string, position: GameCoordinatesDto) {
    const logContext = this.getLogContext(`isValidLocation`);
    const cacheKey = this.getCacheKey(userId, sessionId);
    const lastCollectedPosition: IStoredPosition = await this.cache.get(cacheKey);
    let isValid = false;

    if (!lastCollectedPosition) {
      // For first treasure - it should be valid and assume it's the starting point
      isValid = true;
    } else {
      isValid = this.isPossibleDistanceJump(lastCollectedPosition, position);
    }

    if (isValid) {
      // If is valid store the position
      const storePosition: IStoredPosition = { position, timestamp: new Date().valueOf() };
      const ttlInMs = 24*60*60*1000;
      await this.cache.set(this.getCacheKey(userId, sessionId), storePosition, ttlInMs);
    } 

    if (!isValid) {
      Logger.error(`CHEATING: Location jump too fast ${userId} ${sessionId}`, logContext)
      throw new BadRequestException(`Cheating detected: Location jump too fast`);
    }
  }
}