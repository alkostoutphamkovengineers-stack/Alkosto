import {
  IsOptional,
  IsBoolean,
  IsArray,
  ArrayNotEmpty,
  IsInt,
  IsNumber,
  Min,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@ValidatorConstraint({ name: 'priceRange', async: false })
class PriceRangeConstraint implements ValidatorConstraintInterface {
  validate(minPrice: any, args: ValidationArguments) {
    const obj = args.object as any;
    if (minPrice == null || obj.maxPrice == null) return true;
    return typeof minPrice === 'number' &&
      typeof obj.maxPrice === 'number' &&
      minPrice <= obj.maxPrice;
  }

  defaultMessage() {
    return 'minPrice must be less than or equal to maxPrice';
  }
}

export class FindSearchDto {
  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    required: false,
    description: 'Disponibilidad del producto',
    example: true,
  })
  disponibilidad?: boolean;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @ApiProperty({
    required: false,
    description: 'IDs de las marcas (array de números)',
    type: [Number],
    example: [1, 2],
  })
  idMarca?: number[];

  @IsOptional()
  @IsNumber({}, { message: 'minPrice must be a number' })
  @Min(0)
  @Validate(PriceRangeConstraint)
  @ApiProperty({
    required: false,
    description: 'Precio mínimo',
    example: 1000,
  })
  minPrice?: number;

  @IsOptional()
  @IsNumber({}, { message: 'maxPrice must be a number' })
  @Min(0)
  @ApiProperty({
    required: false,
    description: 'Precio máximo',
    example: 5000,
  })
  maxPrice?: number;
}