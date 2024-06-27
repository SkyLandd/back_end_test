import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { CustomBaseEntity } from "./base.entity";

@Entity({ name: 'user' })
export class UserEntity extends CustomBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'handle', unique: true })
  handle: string;

  @Index()
  @Column({ name: 'email', unique: true })
  email: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'email_verified', default: false })
  emailVerified: boolean;
}