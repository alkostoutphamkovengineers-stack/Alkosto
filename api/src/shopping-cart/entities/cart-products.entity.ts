import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  RelationId,
} from 'typeorm';
import { CartEntity } from './cart.entity';
import { Product } from 'src/products/entities/products.entity';

@Entity({ name: 'carrito_producto', schema: 'public' })
export class CartProductEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ManyToOne(() => CartEntity, { nullable: false })
  @JoinColumn({ name: 'id_carrito' })
  carrito: CartEntity;

  @RelationId((cp: CartProductEntity) => cp.carrito)
  id_carrito: number;

  @ManyToOne(() => Product, { nullable: false })
  @JoinColumn({ name: 'id_producto' })
  producto: Product;

  @RelationId((cp: CartProductEntity) => cp.producto)
  id_producto: number;

  @Column({ type: 'int', name: 'cantidad' })
  amount: number;
}
