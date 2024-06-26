import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { CustomBaseEntity } from "./base.entity";
import { GameCoordinatesDto } from "@modules/game/dtos/treasure-collect.dto";

@Entity({ name: 'user_inventory' })
export class UserInventoryEntity extends CustomBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'treasure_id' })
  treasureId: string;

  @Column({ name: 'treasure_position', type: 'jsonb' })
  position: GameCoordinatesDto;

  @Column({ name: 'session_id' })
  sessionId: string;

  @Column({ name: 'is_traded', default: false })
  isTraded: boolean;
}