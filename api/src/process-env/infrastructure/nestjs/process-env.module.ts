import { Module } from '@nestjs/common';
import { ProcessEnvRepository } from '../../domain/process-env.repository';
import { IEnvParser } from '../../domain/interfaces/env-parser';
import { ZodEnvParser } from '../zod/zod-env-parser';
import { ProcessEnv } from 'src/process-env/application/process.env';

@Module({
  providers: [
    { provide: IEnvParser, useFactory: () => new ZodEnvParser() },
    {
      provide: ProcessEnvRepository,
      useFactory: async (parser: IEnvParser) => {
        const Env = new ProcessEnv(parser);
        await Env.init();
        return Env;
      },
      inject: [IEnvParser],
    },
  ],
  exports: [ProcessEnvRepository],
})
export class ProcessEnvModule {}
