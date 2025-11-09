import { ProcessEnvType } from './types/process-env';

export abstract class ProcessEnvRepository {
  abstract init(env: NodeJS.ProcessEnv): Promise<void>;
  abstract get vars(): ProcessEnvType;
}