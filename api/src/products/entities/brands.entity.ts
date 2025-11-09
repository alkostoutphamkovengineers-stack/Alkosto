import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'marcas', schema: 'public' })
@Unique('marcas_unique', ['nombre'])
export class Brand {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column({ type: 'varchar', name: 'nombre' })
  nombre: string;

  @Column({
    type: 'boolean',
    name: 'activo',
    nullable: true,
    default: () => 'true',
  })
  activo: boolean | null;
}
