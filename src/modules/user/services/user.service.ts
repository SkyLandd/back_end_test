import { IUser, RegisterUserDto } from '@common/dtos/user.dto';
import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserMapper } from '../user.mapper';
import { UserEntity } from '@database/entities/user.entity';
import { IGrantPayload } from '@common/interfaces/IGrantPayload';
import { UserInventoryRepository } from '../repositories/user-inventory.repository';
import { EntityManager } from 'typeorm';
import { CollectTreasureDto } from '@modules/game/dtos/treasure-collect.dto';
import { TradeTreasureDto } from '../dtos/trade-treasure.dto';
import { TradeEntity } from '@database/entities/trade.entity';
import { InventoryStatus } from '../enums/inventory-status.enum';
import { TradeRepository } from '../repositories/trade.repository';
import { TradeStatus } from '../enums/trade-status.enum';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private userMapper: UserMapper,
    private userInventoryRepository: UserInventoryRepository,
    private tradeRepository: TradeRepository,
  ) {}

  private getLogContext(name: string) {
    return `UserService - ${name}`
  }

  private isHashed(password: string) {
    return password.match(/^\$argon2/g)
  }

  private async exists(
    registerUserDto: RegisterUserDto
  ): Promise<boolean> {
    return this.userRepository.exists(registerUserDto);
  }

  /**
   * Registers a new User
   * 
   * @param registerUserDto 
   * @returns IUser
   * @throws ConflictException if user email, handle exists
   * @throws BadRequestException if password is not secure to be stored i.e not hashed (Expects caller to call it securely)
   */
  public async register(
    registerUserDto: RegisterUserDto
  ): Promise<IUser> {
    let logContext = this.getLogContext(`register`);
    const userExists = await this.exists(registerUserDto);
    if (userExists) {
      throw new ConflictException(`User email or handle already exists`);
    }

    if (!this.isHashed(registerUserDto.password)) {
      throw new BadRequestException(`Insecure password in request`);
    }

    const userEntity = this.userMapper.toEntity(registerUserDto);
    const savedUser = await this.userRepository.saveOne(userEntity);
    return this.userMapper.toUser(savedUser);
  }

  /**
   * Find and returns a user with given id or email
   * 
   * @param filter 
   * @returns IUser
   * @throws NotFoundException if user with passed param does not exist
   */
  public async getOneOrThrow(filter: { id?: string, email?: string }, withPassword?: boolean): Promise<IUser | UserEntity> {
    const user = await this.userRepository.findOneBy(filter);
    if (!user) {
      throw new NotFoundException(`User with details not found`);
    }

    return withPassword ? user : this.userMapper.toUser(user);
  }

  /**
   * Updates email verification for user
   * 
   * @param user 
   */
  public async updateEmailVerified(user: IGrantPayload) {
    const userToUpdate = new UserEntity();
    userToUpdate.id = user.id;
    userToUpdate.emailVerified = true;
    await this.userRepository.saveOne(userToUpdate);
  }

  /**
   * Add treasure to user inventory
   * 
   * @param user 
   * @param treasureId 
   */
  public async addTreasure(user: IGrantPayload, treasureDto: CollectTreasureDto, transactionManager: EntityManager) {
    await this.userInventoryRepository.saveTreasure(
      [this.userMapper.toUserInventory(user, treasureDto)],
      transactionManager
    )
  }

  public getInventoryTransactionManager() {
    return this.userInventoryRepository.getManager();
  }

  public async initiateTrade(tradeTreasureDto: TradeTreasureDto, user: IGrantPayload) {
    const tradeEntity = this.userMapper.toTradeEntity(tradeTreasureDto, user);
    const manager = this.userInventoryRepository.getManager();
    await manager.transaction(async (transactionManager) => {
      await this.validateInventoryStatus(tradeEntity, InventoryStatus.COLLECTED, transactionManager);
      await this.userInventoryRepository.updateInventoryStatus(
        tradeEntity.initiatorInventoryId, 
        InventoryStatus.ACTIVE_TRADE, 
        transactionManager
      );
      await this.userInventoryRepository.updateInventoryStatus(
        tradeEntity.recepientInventoryId, 
        InventoryStatus.ACTIVE_TRADE, 
        transactionManager
      );
      await this.tradeRepository.save(tradeEntity, transactionManager);
    })
  }

  private async validateInventoryStatus(tradeEntity: TradeEntity, status: InventoryStatus, transactionManager: EntityManager) {
    const initiatorInventory = await this.userInventoryRepository.findInventoryBy({ 
      id: tradeEntity.initiatorInventoryId, userId: tradeEntity.initiatorUserId
    }, transactionManager)

    if (!initiatorInventory || initiatorInventory.inventoryStatus !== status) {
      throw new BadRequestException(`Trade not possible with selected cards`);
    }

    const recepientInventory = await this.userInventoryRepository.findInventoryBy({ 
      id: tradeEntity.recepientInventoryId, userId: tradeEntity.recepientUserId 
    }, transactionManager)

    if (!recepientInventory || recepientInventory.inventoryStatus !== status) {
      throw new BadRequestException(`Trade not possible with selected cards`);
    }

    return { initiatorInventory, recepientInventory };
  }

  public async requestedTrades(user: IGrantPayload) {
    return this.tradeRepository.findTradeBy({ recepientUserId: user.id, status: TradeStatus.INITIATED });
  }

  public async initiatedTrades(user: IGrantPayload) {
    return this.tradeRepository.findTradeBy({ initiatorUserId: user.id, status: TradeStatus.INITIATED });
  }

  public async getTradeMarket(user: IGrantPayload) {
    return this.userInventoryRepository.findBulkInventory({ userId: user.id })
  }

  public async getTreasures(user: IGrantPayload) {
    return this.userInventoryRepository.findBulkInventory({ userId: user.id, self: true })
  }

  public async acceptTrade(tradeId: string, user: IGrantPayload) {
    const logContext = this.getLogContext(`acceptTrade - ${tradeId}`)
    const trades = await this.tradeRepository.findTradeBy({ id: tradeId, recepientUserId: user.id });
    if (!trades?.length) {
      throw new NotFoundException(`Trade not found`);
    }

    const currentTrade = trades[0];
    if (currentTrade.recepientUserId !== user.id) {
      Logger.error(`CHEATING: User ${user.id} trying to accept someone else's trade`, logContext);
      throw new NotFoundException(`Trade not found`);
    }

    // Trade
    const tradeToUpdate = new TradeEntity()
    tradeToUpdate.id = tradeId;
    tradeToUpdate.status = TradeStatus.COMPLETED;

    const tradeManager = this.tradeRepository.getManager();
    await tradeManager.transaction(async (transactionManager) => {
      const { initiatorInventory, recepientInventory } = await this.validateInventoryStatus(currentTrade, InventoryStatus.ACTIVE_TRADE, transactionManager);
      
      const inventoriesToAddUpdate = this.userMapper.toTradeAcceptedTreasureEntity(currentTrade, initiatorInventory, recepientInventory);
      await this.userInventoryRepository.saveTreasure(
        inventoriesToAddUpdate,
        transactionManager
      );
      await this.userInventoryRepository.updateInventoryStatus(
        currentTrade.recepientInventoryId, 
        InventoryStatus.TRADED, 
        transactionManager
      );
      await this.tradeRepository.save(tradeToUpdate, transactionManager);
    })
  }
}
