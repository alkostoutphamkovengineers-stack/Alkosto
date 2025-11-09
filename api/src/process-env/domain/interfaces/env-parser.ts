import { ProcessEnvType } from '../types/process-env';

export abstract class IEnvParser {
  abstract parse(env: NodeJS.ProcessEnv): Promise<ProcessEnvType>;
}
