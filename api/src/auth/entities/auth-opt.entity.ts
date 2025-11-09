import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsersEntity } from '../../users/entities/users.entity';

@Entity({ name: 'autenticacion_opt' })
export class AuthOptEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'int', name: 'id_usuario' })
  id_usuario: number;

  @Column({ type: 'varchar', name: 'otp_code', length: 6, nullable: true })
  otpCode: string | null;

  @Column({ type: 'timestamp', name: 'otp_expires_at', nullable: true })
  otpExpiresAt: Date | null;

  @Column({ type: 'varchar', name: 'method', nullable: true })
  method: string | null;

  @Column({
    type: 'char',
    name: 'verified',
    length: 1,
    default: () => "'N'",
    nullable: true,
  })
  verified: string | null;

  @ManyToOne(() => UsersEntity, { nullable: false })
  @JoinColumn({ name: 'id_usuario', referencedColumnName: 'id' })
  usuario: UsersEntity;
}
