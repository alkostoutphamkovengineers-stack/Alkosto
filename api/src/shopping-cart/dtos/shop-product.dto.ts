import { IsNumber, IsPositive, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ShopProductDto {
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    required: false,
    description: 'ID de usuario',
    example: 1,
  })
  userId: number;

  @IsNumber()
  @IsPositive()
  @ApiProperty({
    required: false,
    description: 'ID de producto',
    example: 1,
  })
  productId: number;

  @IsNumber()
  @Min(0)
  @ApiProperty({
    required: false,
    description: 'cantidad producto',
    example: 3,
  })
  amount: number;
}
