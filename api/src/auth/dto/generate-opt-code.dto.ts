import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateIf,
} from 'class-validator';

export enum OtpDeliveryMethod {
  EMAIL = 'email',
  SMS = 'sms',
  WHATSAPP = 'whatsapp',
}

export class GenerateOtpCodeDto {
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

  @ApiPropertyOptional({
    description: 'Correo electrónico del usuario',
    example: 'usuario@correo.com',
    required: true,
  })
  @ValidateIf(o => o.method === OtpDeliveryMethod.EMAIL)
  @IsNotEmpty({
    message: 'El correo electrónico es requerido cuando el método es "email"',
  })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email: string;

  @ApiPropertyOptional({
    description:
      'Número de teléfono del usuario en formato internacional E.164',
    example: '+573001112233',
    required: false,
  })
  @ValidateIf(
    o =>
      o.method === OtpDeliveryMethod.SMS ||
      o.method === OtpDeliveryMethod.WHATSAPP,
  )
  @IsNotEmpty({
    message:
      'El número de teléfono es requerido cuando el método es "sms" o "whatsapp"',
  })
  @IsString({ message: 'El número de teléfono debe ser una cadena' })
  phoneNumber?: string;
}
