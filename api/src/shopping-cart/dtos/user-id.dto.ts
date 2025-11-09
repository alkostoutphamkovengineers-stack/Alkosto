import { IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserIdDto {
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    required: false,
    description: 'ID de usuario',
    example: 1,
  })
  userId: number;
}