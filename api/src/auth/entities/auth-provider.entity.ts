import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsersEntity } from '../../users/entities/users.entity';

@Entity({ name: 'proveedor_autenticacion' })
export class AuthProviderEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'varchar', name: 'id_externo', nullable: true })
  idExterno: string | null;

  @Column({ type: 'varchar', name: 'contraseña', nullable: true })
  contrasena: string | null;

  @Column({
    type: 'bool',
    name: 'activo',
    default: () => 'true',
    nullable: true,
  })
  activo: boolean | null;

  @Column({ type: 'int', name: 'id_usuario', nullable: true })
  id_usuario: number | null;

  @Column({ type: 'int', name: 'id_tipo_autenticacion', nullable: true })
  id_tipo_autenticacion: number | null;

  @ManyToOne(() => UsersEntity, { nullable: true })
  @JoinColumn({ name: 'id_usuario', referencedColumnName: 'id' })
  usuario: UsersEntity | null;
}
