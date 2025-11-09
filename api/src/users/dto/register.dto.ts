import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterUserDto {
  @ApiPropertyOptional({
    description: 'Nombre del usuario',
    example: 'Juan',
  })
  @IsString({ message: 'El nombre debe ser una cadena' })
  nombre: string;

  @ApiPropertyOptional({
    description: 'Apellido del usuario',
    example: 'Pérez',
  })
  @IsString({ message: 'El apellido debe ser una cadena' })
  apellido: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@correo.com',
    required: true,
  })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email: string;

  @ApiPropertyOptional({
    description: 'Teléfono de contacto',
    example: '+57 3001234567',
  })
  @IsString({ message: 'El teléfono debe ser una cadena' })
  telefono: string;
}