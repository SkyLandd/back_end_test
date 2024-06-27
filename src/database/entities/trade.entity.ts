import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { CustomBaseEntity } from "./base.entity";
import { TradeStatus } from "@modules/user/enums/trade-status.enum";

@Entity({ name: 'trade' })
export class TradeEntity extends CustomBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'initiator_user_id' })
  initiatorUserId: string;

  @Column({ name: 'recepient_user_id' })
  recepientUserId: string;

  @Column({ name: 'status', default: TradeStatus.INITIATED })
  status: TradeStatus;

  // Ideally treasures should be maintained separately in another trade detail table, 
  // which given more flexibility in number of treasures to trade
  // I am keeping it in same table, assuming trades are happening for single treasures 
  // and no change is allowed once initiated
  @Column({ name: 'initiator_inventory_id' })
  initiatorInventoryId: string;

  @Column({ name: 'recepient_inventory_id' })
  recepientInventoryId: string;
}