import * as crypto from 'crypto';
import { HttpException, Injectable, Logger } from "@nestjs/common";
import { CollectTreasureDto } from "../dtos/treasure-collect.dto";
import { TreasureDistributionService } from "./treasure-distribution.service";
import { UserLocationService } from "./user-location.service";
import { IGrantPayload } from "@common/interfaces/IGrantPayload";
import { CollectionLimitService } from "../../treasure/services/collection-limit.service";
import { UserService } from "@modules/user/services/user.service";
import { EntityManager } from "typeorm";
import { TreasureService } from "@modules/treasure/services/treasure.service";
import { TreasureType } from "@modules/treasure/enums/treasure-type.enum";
import { UnknownException } from '@common/exceptions/Unknown.exception';

@Injectable()
export class GameService {
  constructor(
    private treasureDistributionService: TreasureDistributionService,
    private userLocationService: UserLocationService,
    private collectionLimitService: CollectionLimitService,
    private userService: UserService,
    private treasureService: TreasureService,
  ) { }

  private getLogContext(name: string) {
    return `GameService - ${name}`
  }

  public async createSession() {
    const treasures = await this.treasureService.findBulkBy({ types: [TreasureType.COMMON, TreasureType.RARE, TreasureType.EPIC, TreasureType.LEGENDARY] });
    const sessionId = crypto.randomUUID();
    const sessionTreasures = await this.treasureDistributionService.distributeTreasures(treasures, sessionId);
    return { id: sessionId, treasures: sessionTreasures };
  }

  public async collectTreasure(
    collectTreasureDto: CollectTreasureDto,
    user: IGrantPayload
  ) {
    const logContext = this.getLogContext(`collectTreasure - ${user.id}`)
    try {
      // 1. Validate User's Position - Check if the jump is permissible
      await this.userLocationService.isValidLocation(
        user.id, collectTreasureDto.sessionId, collectTreasureDto.treasurePosition
      );

      // 2. Validate Treasure coordinates in cache
      await this.treasureDistributionService.isValidTreasure(
        collectTreasureDto.treasureId, collectTreasureDto.sessionId, collectTreasureDto.treasurePosition
      );
      
      // 3. Validate daily and weekly violation
      // 4. Add to treasure collection
      // 5. Update daily and weekly count
      const entityManager = this.userService.getInventoryTransactionManager();
      await entityManager.transaction(async (transactionManager: EntityManager) => {
        await this.collectionLimitService.allowedTreasureCollection(user.id);
        await this.userService.addTreasure(user, collectTreasureDto, transactionManager);
        await this.collectionLimitService.updateCollected(user.id);
        await this.treasureDistributionService.removeTreasure(collectTreasureDto.treasureId, collectTreasureDto.sessionId);
      });

      // Intentionally running in background
      this.userService.applyTreasureCollectionSideEffects(user);
    } catch(err) {
      Logger.error(`Error while collecting treasure ${JSON.stringify(collectTreasureDto)}`, logContext);
      if (err instanceof HttpException) {
        throw err;
      }

      throw new UnknownException();
    }
  }
}