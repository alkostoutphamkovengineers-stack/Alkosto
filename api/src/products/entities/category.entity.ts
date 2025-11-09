import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToOne,
  OneToMany,
  JoinColumn,
  RelationId,
} from 'typeorm';

@Entity({ name: 'categorias', schema: 'public' })
@Unique('categorias_unique', ['nombre'])
export class Categoria {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column({ name: 'nombre', type: 'varchar' })
  nombre: string;

  @Column({
    name: 'activo',
    type: 'boolean',
    nullable: true,
    default: () => 'true',
  })
  activo?: boolean | null;

  @RelationId((categoria: Categoria) => categoria.padre)
  idCategoriaPadre?: number | null;

  @ManyToOne(() => Categoria, categoria => categoria.hijos, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'id_categoria_padre' })
  padre?: Categoria | null;

  @OneToMany(() => Categoria, categoria => categoria.padre)
  hijos?: Categoria[];
}
