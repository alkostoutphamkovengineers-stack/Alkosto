
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessEnvRepository } from 'src/process-env/domain/process-env.repository';
import { ProcessEnvModule } from 'src/process-env/infrastructure/nestjs/process-env.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ProcessEnvModule],
      inject: [ProcessEnvRepository],
      useFactory: (env: ProcessEnvRepository) => {
        return {
          type: 'postgres',
          url: env.vars.postgreURL,
          entities: [__dirname + '/../**/entities/*.entity{.ts,.js}'],
          autoLoadEntities: true,
          synchronize: false,
        };
      },
    }),
  ],
})
export class PgTypeormModule {}