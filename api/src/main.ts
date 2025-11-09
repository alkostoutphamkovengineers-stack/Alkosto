require('../load-env');

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ProcessEnvRepository } from './process-env/domain/process-env.repository';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  SwaggerModule.setup('docs', app, () =>
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Alkosto_HamKov Enginners API')
        .setVersion('1.0.0')
        .build(),
    ),
  );

  const processEnvRepo = app.get<ProcessEnvRepository>(ProcessEnvRepository);
  await app.listen(processEnvRepo.vars.port, () => {
    logger.log(`Server running in port: ${processEnvRepo.vars.port}`);
  });
}
bootstrap();
