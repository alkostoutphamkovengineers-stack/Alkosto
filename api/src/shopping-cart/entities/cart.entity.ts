import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  RelationId,
  OneToMany,
} from 'typeorm';
import { UsersEntity } from '../../users/entities/users.entity';
import { CartProductEntity } from './cart-products.entity';

@Entity({ name: 'carrito' })
export class CartEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @RelationId((carrito: CartEntity) => carrito.usuario)
  id_usuario: number;

  @ManyToOne(() => UsersEntity, { nullable: false })
  @JoinColumn({ name: 'id_usuario' })
  usuario: UsersEntity;

  @Column({ type: 'boolean', name: 'activo', default: true, nullable: true })
  activo: boolean | null;

  @OneToMany(() => CartProductEntity, (cp) => cp.carrito)
  productos: CartProductEntity[];
}
