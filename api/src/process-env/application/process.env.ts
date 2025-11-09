import { ProcessEnvRepository } from '../domain/process-env.repository';
import { ProcessEnvType } from '../domain/types/process-env';
import { IEnvParser } from '../domain/interfaces/env-parser';

export class ProcessEnv implements ProcessEnvRepository {
  private envVars: ProcessEnvType;

  constructor(private readonly parser: IEnvParser) {}

  public async init(env: NodeJS.ProcessEnv = process.env): Promise<void> {
    this.envVars = await this.parser.parse(env);
  }

  public get vars(): ProcessEnvType {
    return this.envVars;
  }
}