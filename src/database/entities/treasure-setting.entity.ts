import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { CustomBaseEntity } from "./base.entity";
import { TreasureSettingType } from "@modules/treasure/enums/treasure-setting-type.enum";

@Entity({ name: 'treasure_setting' })
export class TreasureSettingEntity extends CustomBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'type', unique: true })
  type: TreasureSettingType;

  @Column({ name: 'value' })
  value: string;
}