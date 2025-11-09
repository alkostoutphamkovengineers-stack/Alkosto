import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { OtpDeliveryMethod } from './generate-opt-code.dto';

export class ValidOptCodeDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@correo.com',
    required: true,
  })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email: string;

  @ApiProperty({
    description: 'Código OPT ingresado por el usuario',
    example: '123456',
    required: true,
  })
  @IsNotEmpty({ message: 'El código OPT es requerido' })
  @IsString({ message: 'El código OPT debe ser una cadena' })
  optCode: string;

  @ApiProperty({
    description: 'Método de envío del código OTP',
    enum: OtpDeliveryMethod,
    example: OtpDeliveryMethod.EMAIL,
    required: true,
  })
  @IsNotEmpty({ message: 'El método es requerido' })
  @IsEnum(OtpDeliveryMethod, {
    message: 'El método debe ser "email" o "sms"',
  })
  method: OtpDeliveryMethod;
}
