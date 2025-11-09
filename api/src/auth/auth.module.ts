import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SendOtpEmail } from './use-cases/send-code-opt-email';
import { ProcessEnvModule } from 'src/process-env/infrastructure/nestjs/process-env.module';
import { ProcessEnvRepository } from 'src/process-env/domain/process-env.repository';
import { AuthRepository } from './repository/auth.repository';
import { DataSource } from 'typeorm';
import { AuthTypeorm } from './repository/auth.typeorm';
import { SendOtpSms, TwilioSmsConfig } from './use-cases/send-code-opt-sms';
import {
  SendOtpWhatsapp,
  TwilioWhatsappConfig,
} from './use-cases/send-code-opt-whatsapp';

@Module({
  imports: [ProcessEnvModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: AuthRepository,
      useFactory: (dataSource: DataSource) => new AuthTypeorm(dataSource),
      inject: [DataSource],
    },
    {
      provide: SendOtpEmail,
      useFactory: (env: ProcessEnvRepository) =>
        new SendOtpEmail({
          user: env.vars.emailUser,
          pass: env.vars.emailPassword,
          appName: 'AkostoUTP',
        }),
      inject: [ProcessEnvRepository],
    },
    {
      provide: SendOtpSms,
      useFactory: () => {
        const cfg: TwilioSmsConfig = {
          accountSid: process.env.TWILIO_SID!,
          authToken: process.env.TWILIO_TOKEN!,
          from: process.env.TWILIO_SMS_NUMBER!,
          appName: 'AkostoUTP',
          ttlMinutes: 1,
        };
        return new SendOtpSms(cfg);
      },
    },
    {
      provide: SendOtpWhatsapp,
      useFactory: () => {
        const cfg: TwilioWhatsappConfig = {
          accountSid: process.env.TWILIO_SID!,
          authToken: process.env.TWILIO_TOKEN!,
          from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER!}`,
          appName: 'AkostoUTP',
          ttlMinutes: 1,
        };
        return new SendOtpWhatsapp(cfg);
      },
    },
  ],
  exports: [SendOtpEmail],
})
export class AuthModule {}
