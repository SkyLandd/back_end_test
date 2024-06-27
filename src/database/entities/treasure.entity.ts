import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { CustomBaseEntity } from "./base.entity";
import { TreasureType } from "@modules/treasure/enums/treasure-type.enum";

@Entity({ name: 'treasure' })
export class TreasureEntity extends CustomBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name' })
  name: string;

  @Index()
  @Column({ name: 'type' })
  type: TreasureType;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}