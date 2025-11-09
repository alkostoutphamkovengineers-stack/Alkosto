import { IsOptional, IsString, IsNumber, IsBoolean, IsPositive, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindProductsDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'Nombre del producto',
    example: 'Producto ejemplo',
  })
  nombre: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'Descripción del producto',
    example: 'Descripción del producto',
  })
  descripcion: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    required: false,
    description: 'Precio base del producto',
    example: 100.00,
  })
  precioBase: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'Código del producto',
    example: 'PROD-001',
  })
  codigo: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    required: false,
    description: 'Disponibilidad del producto',
    example: true,
  })
  disponibilidad: boolean;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    required: false,
    description: 'ID de la categoría',
    example: 1,
  })
  idCategoria: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    required: false,
    description: 'ID de la marca',
    example: 1,
  })
  idMarca: number;
}