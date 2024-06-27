import { IUser, RegisterUserDto } from "@common/dtos/user.dto";
import { IGrantPayload } from "@common/interfaces/IGrantPayload";
import { UserInventoryEntity } from "@database/entities/user-inventory.entity";
import { UserEntity } from "@database/entities/user.entity";
import { CollectTreasureDto } from "@modules/game/dtos/treasure-collect.dto";
import { Injectable } from "@nestjs/common";
import { TradeTreasureDto } from "./dtos/trade-treasure.dto";
import { TradeEntity } from "@database/entities/trade.entity";
import { InventoryStatus } from "./enums/inventory-status.enum";

@Injectable()
export class UserMapper {
  constructor() { }

  public toEntity(registerDto: RegisterUserDto) {
    const userEntity = new UserEntity();

    userEntity.email = registerDto.email;
    userEntity.handle = registerDto.handle;
    userEntity.password = registerDto.password;

    return userEntity;
  }

  public toUser(userEntity: UserEntity) {
    const user: IUser = {
      email: userEntity.email,
      emailVerified: userEntity.emailVerified,
      handle: userEntity.handle,
      id: userEntity.id
    };

    return user;
  }

  public toUserInventory(user: IGrantPayload, treasureDto: CollectTreasureDto) {
    const userInventoryEntity = new UserInventoryEntity();

    userInventoryEntity.treasureId = treasureDto.treasureId;
    userInventoryEntity.position = treasureDto.treasurePosition;
    userInventoryEntity.sessionId = treasureDto.sessionId;
    userInventoryEntity.userId = user.id;

    return userInventoryEntity;
  }

  public toTradeEntity(tradeTreasureDto: TradeTreasureDto, user: IGrantPayload) {
    const tradeEntity: TradeEntity = new TradeEntity();

    tradeEntity.initiatorInventoryId = tradeTreasureDto.initiatorInventoryId;
    tradeEntity.initiatorUserId = user.id;
    tradeEntity.recepientInventoryId = tradeTreasureDto.recepientInventoryId;
    tradeEntity.recepientUserId = tradeTreasureDto.recepientUserId;

    return tradeEntity;
  }

  public toTradeAcceptedTreasureEntity(currentTrade: TradeEntity, initiatorInventory: UserInventoryEntity, recepientInventory: UserInventoryEntity) {
    const tradeId = currentTrade.id;

    // Initiator Treasure
    const initiatorInventoryToUpdate = new UserInventoryEntity();
    initiatorInventoryToUpdate.id = currentTrade.initiatorInventoryId;
    initiatorInventoryToUpdate.inventoryStatus = InventoryStatus.TRADED;
    initiatorInventoryToUpdate.tradeId = tradeId;

    const initiatorCollectedInventory = new UserInventoryEntity();
    initiatorCollectedInventory.treasureId = recepientInventory.treasureId;
    initiatorCollectedInventory.userId = currentTrade.initiatorUserId;
    initiatorCollectedInventory.inventoryStatus = InventoryStatus.COLLECTED;
    initiatorCollectedInventory.tradeId = tradeId;

    // Recepient Treasure
    const recepientCollectedInventory = new UserInventoryEntity();
    recepientCollectedInventory.treasureId = initiatorInventory.treasureId;
    recepientCollectedInventory.userId = currentTrade.recepientUserId;
    recepientCollectedInventory.inventoryStatus = InventoryStatus.COLLECTED;
    recepientCollectedInventory.tradeId = tradeId;

    const recepientInventoryToUpdate = new UserInventoryEntity();
    recepientInventoryToUpdate.id = currentTrade.recepientInventoryId;
    recepientInventoryToUpdate.inventoryStatus = InventoryStatus.TRADED;
    recepientInventoryToUpdate.tradeId = tradeId;

    return [initiatorInventory, initiatorCollectedInventory, recepientInventory, recepientCollectedInventory];
  }
}