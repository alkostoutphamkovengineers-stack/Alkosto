import { Injectable, Logger } from '@nestjs/common';
import { Twilio } from 'twilio';

export interface TwilioWhatsappConfig {
  accountSid: string;
  authToken: string;
  from: string;
  appName?: string;
  ttlMinutes?: number;
}

@Injectable()
export class SendOtpWhatsapp {
  private readonly logger = new Logger(SendOtpWhatsapp.name);
  private readonly client: Twilio;
  private readonly appName: string;
  private readonly from: string;
  private readonly ttlMinutes: number;

  constructor(private readonly cfg: TwilioWhatsappConfig) {
    this.client = new Twilio(cfg.accountSid, cfg.authToken);
    this.appName = cfg.appName ?? 'Verificación';
    this.from = cfg.from.startsWith('whatsapp:')
      ? cfg.from
      : `whatsapp:${cfg.from}`;
    this.ttlMinutes = cfg.ttlMinutes ?? 1;
  }

  async execute(
    phoneE164: string,
    code: string,
  ): Promise<{ code: string; expiresAt: Date }> {
    this.ensureValidWhatsApp(phoneE164);

    const expiresAt = new Date(Date.now() + this.ttlMinutes * 60_000);

    const minutesLabel =
      this.ttlMinutes === 1 ? '1 minuto' : `${this.ttlMinutes} minutos`;
    const body = [
      '¡Hola! 👋',
      `Estás verificando tu número para ${this.appName}.`,
      '',
      `Tu código de verificación es: *${code}*`,
      `⏳ Caduca en ${minutesLabel}. Es de un solo uso.`,
      '',
      'Sigue estos pasos:',
      `1) Abre ${this.appName} e ingresa el código tal como aparece.`,
      `2) No compartas este código. El equipo de ${this.appName} nunca lo pedirá.`,
      '3) Si no fuiste tú, ignora este mensaje.',
      '',
      `— Equipo de ${this.appName}`,
    ].join('\n');

    try {
      await this.client.messages.create({
        from: this.from,
        to: `whatsapp:${phoneE164}`,
        body,
      });

      this.logger.log(`OTP WhatsApp enviado a ${phoneE164}`);
      return { code, expiresAt };
    } catch (err: any) {
      this.logger.error(
        `Error WhatsApp a ${phoneE164}: ${err?.code ?? ''} ${err?.message ?? err}`,
      );
      throw new Error(this.humanizeTwilioError(err));
    }
  }

  private ensureValidWhatsApp(phoneE164: string): void {
    const e164 = /^\+[1-9]\d{6,14}$/;
    if (!e164.test(phoneE164)) {
      throw new Error(
        'Número inválido. Usa formato E.164, p. ej. +573001234567',
      );
    }
  }

  private humanizeTwilioError(err: any): string {
    switch (err?.code) {
      case 63018:
        return 'El destinatario no se ha unido al Sandbox de WhatsApp.';
      case 63016:
        return 'Remitente de WhatsApp inválido o no habilitado.';
      case 21211:
        return 'Número de destino inválido.';
      default:
        return 'No se pudo enviar el WhatsApp de verificación.';
    }
  }
}
