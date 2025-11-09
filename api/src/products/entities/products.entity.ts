import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  RelationId,
} from 'typeorm';
import { Categoria } from './category.entity';
import { Brand } from './brands.entity';

@Entity({ name: 'productos', schema: 'public' })
export class Product {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column({ name: 'nombre', type: 'varchar' })
  nombre: string;

  @Column({ name: 'descripcion', type: 'varchar' })
  descripcion: string;

  @Column({ name: 'precio_base', type: 'numeric' })
  precioBase: string;

  @Column({ name: 'cantidad', type: 'integer' })
  cantidad: number;

  @Column({ name: 'codigo', type: 'varchar' })
  codigo: string;

  @Column({ name: 'imagen', type: 'varchar' })
  imagen: string;

  @Column({
    name: 'disponibilidad',
    type: 'boolean',
    default: () => 'false',
  })
  disponibilidad: boolean;

  @Column({
    name: 'activo',
    type: 'boolean',
    nullable: true,
    default: () => 'true',
  })
  activo?: boolean | null;

  @RelationId((product: Product) => product.categoria)
  idCategoria: number;

  @ManyToOne(() => Categoria)
  @JoinColumn({ name: 'id_categoria' })
  categoria: Categoria;

  @RelationId((product: Product) => product.marca)
  idMarca: number;

  @ManyToOne(() => Brand)
  @JoinColumn({ name: 'id_marca' })
  marca: Brand;
}
