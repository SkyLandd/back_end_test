import { IUser, RegisterUserDto } from "@common/dtos/user.dto";
import { IGrantPayload } from "@common/interfaces/IGrantPayload";
import { UserInventoryEntity } from "@database/entities/user-inventory.entity";
import { UserEntity } from "@database/entities/user.entity";
import { CollectTreasureDto } from "@modules/game/dtos/treasure-collect.dto";
import { Injectable } from "@nestjs/common";
import { TradeTreasureDto } from "./dtos/trade-treasure.dto";
import { TradeEntity } from "@database/entities/trade.entity";

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
}