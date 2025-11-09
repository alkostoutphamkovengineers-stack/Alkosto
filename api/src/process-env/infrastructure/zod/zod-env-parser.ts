import { z, ZodSchema } from 'zod';
import { ProcessEnvType } from '../../domain/types/process-env';
import { IEnvParser } from '../../domain/interfaces/env-parser';

export class ZodEnvParser implements IEnvParser {
  private readonly schema: ZodSchema<ProcessEnvType> = z.object({
    host: z.string(),
    port: z.coerce.number(),
    postgreURL: z.string(),
    emailUser: z.string(),
    emailPassword: z.string(),
    twilioSid: z.string(),
    twilioToken: z.string(),
    twilioSMSNumber: z.string(),
    twilioWhatsappNumber: z.string(),
  });

  public async parse(env: NodeJS.ProcessEnv): Promise<ProcessEnvType> {
    return this.schema.parseAsync({
      host: env.HOST,
      port: Number(env.PORT),
      postgreURL: env.DATABASE_CONNECTION_STRING,
      emailUser: env.EMAIL_USER,
      emailPassword: env.EMAIL_PASSWORD,
      twilioSid: env.TWILIO_SID,
      twilioToken: env.TWILIO_TOKEN,
      twilioSMSNumber: env.TWILIO_SMS_NUMBER,
      twilioWhatsappNumber: env.TWILIO_WHATSAPP_NUMBER,
    });
  }
}
