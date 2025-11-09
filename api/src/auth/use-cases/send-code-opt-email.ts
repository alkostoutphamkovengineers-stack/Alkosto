import { Injectable, Logger } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';

export interface GmailConfig {
  user: string;
  pass: string;
  from?: string;
  appName?: string;
  ttlMinutes?: number;
}

@Injectable()
export class SendOtpEmail {
  private readonly transporter: Transporter;
  private readonly logger = new Logger(SendOtpEmail.name);
  private readonly appName: string;
  private readonly from: string;
  private readonly ttlMinutes: number;

  constructor(private readonly gmail: GmailConfig) {
    this.transporter = createTransport({
      service: 'gmail',
      auth: {
        user: gmail.user,
        pass: gmail.pass,
      },
    });

    this.appName = gmail.appName ?? 'Verificación';
    this.from = gmail.from ?? `${this.appName} <${gmail.user}>`;
    this.ttlMinutes = gmail.ttlMinutes ?? 1;
  }

  async execute(
    email: string,
    code: string,
  ): Promise<{ code: string; expiresAt: Date }> {
    this.ensureValidEmail(email);

    const expiresAt = new Date(Date.now() + this.ttlMinutes * 60_000);

    const subject = `${this.appName} - Tu código es ${code}`;
    const text = this.renderText(code);
    const html = this.renderHtml(code);

    try {
      await this.transporter.sendMail({
        from: this.from,
        to: email,
        subject,
        text,
        html,
      });

      this.logger.log(`Código enviado a ${email}`);
      return { code, expiresAt };
    } catch (error) {
      this.logger.error(`Error enviando correo a ${email}: ${error.message}`);
      throw new Error('No se pudo enviar el correo de verificación');
    }
  }

  private renderText(code: string): string {
    const minutesLabel =
      this.ttlMinutes === 1 ? '1 minuto' : `${this.ttlMinutes} minutos`;

    return [
      '¡Hola! 👋',
      '',
      `Estás verificando tu cuenta para ${this.appName}.`,
      '',
      `Tu código de verificación es: ${code}`,
      '',
      `⏳ Este código caduca en ${minutesLabel} y es de un solo uso.`,
      '',
      'Pasos a seguir:',
      `1) Abre ${this.appName} e ingresa el código tal como aparece.`,
      `2) No compartas este código. El equipo de ${this.appName} nunca te lo pedirá.`,
      '3) Si no solicitaste este código, puedes ignorar este mensaje de forma segura.',
      '',
      `— Equipo de ${this.appName}`,
    ].join('\n');
  }

  private renderHtml(code: string): string {
    const minutesLabel =
      this.ttlMinutes === 1 ? '1 minuto' : `${this.ttlMinutes} minutos`;

    return `
      <div style="font-family: Roboto, Arial, sans-serif; max-width:600px; margin:0 auto; line-height:1.6; color:#333">
        <div style="background:linear-gradient(135deg, #0b66a3 0%, #0a5a8f 100%); padding:32px 24px; border-radius:12px 12px 0 0;">
          <h1 style="margin:0; color:#fff; font-size:28px; font-weight:600;">${this.appName}</h1>
          <p style="margin:8px 0 0; color:#f0f0f0; font-size:16px;">Verificación de cuenta</p>
        </div>
        
        <div style="background:#ffffff; padding:32px 24px; border:1px solid #eee; border-top:none; border-radius:0 0 12px 12px; box-shadow:0 6px 16px rgba(30,30,30,0.06);">
          <p style="margin:0 0 24px; font-size:16px;">¡Hola! 👋</p>
          
          <p style="margin:0 0 24px; font-size:15px; color:#666;">
            Estás verificando tu cuenta para <strong>${this.appName}</strong>.
          </p>
          
          <div style="background:#f9fafb; border-left:4px solid #ff6f00; padding:20px; margin:24px 0; border-radius:6px;">
            <p style="margin:0 0 12px; font-size:14px; color:#6d6d6d; font-weight:500;">Tu código de verificación:</p>
            <div style="font-size:32px; font-weight:700; letter-spacing:6px; color:#0b66a3; font-family:monospace;">
              ${code}
            </div>
          </div>
          
          <p style="margin:0 0 24px; font-size:14px; color:#666;">
            ⏳ Este código caduca en <strong>${minutesLabel}</strong> y es de un solo uso.
          </p>
          
          <div style="background:#fff9f0; border:1px solid #ffd699; padding:20px; border-radius:8px; margin:24px 0;">
            <p style="margin:0 0 12px; font-weight:600; color:#ff6f00; font-size:15px;">📋 Pasos a seguir:</p>
            <ol style="margin:0; padding-left:20px; color:#263238;">
              <li style="margin-bottom:8px;">Abre <strong>${this.appName}</strong> e ingresa el código tal como aparece.</li>
              <li style="margin-bottom:8px;">No compartas este código. El equipo de <strong>${this.appName}</strong> nunca te lo pedirá.</li>
              <li style="margin-bottom:0;">Si no solicitaste este código, puedes ignorar este mensaje de forma segura.</li>
            </ol>
          </div>
          
          <hr style="border:none; border-top:1px solid #eee; margin:32px 0;" />
          
          <p style="margin:0; color:#8b8b8b; font-size:13px;">
            — Equipo de ${this.appName}
          </p>
        </div>
        
        <div style="text-align:center; padding:24px; color:#8b8b8b; font-size:12px;">
          <p style="margin:0;">Este es un mensaje automático, por favor no respondas a este correo.</p>
        </div>
      </div>
    `;
  }

  private ensureValidEmail(email: string): void {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) {
      throw new Error('Correo electrónico inválido');
    }
  }
}
