import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { CustomBaseEntity } from "./base.entity";
import { GameCoordinatesDto } from "@modules/game/dtos/treasure-collect.dto";
import { InventoryStatus } from "@modules/user/enums/inventory-status.enum";

@Entity({ name: 'user_inventory' })
export class UserInventoryEntity extends CustomBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'treasure_id' })
  treasureId: string;

  @Column({ name: 'treasure_position', type: 'jsonb', nullable: true })
  position: GameCoordinatesDto;

  @Column({ name: 'session_id', nullable: true })
  sessionId: string;

  @Column({ name: 'trade_id', nullable: true })
  tradeId: string;

  @Column({ name: 'status', default: InventoryStatus.COLLECTED })
  inventoryStatus: InventoryStatus;
}