import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const serverConfig = config.get('server');
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  const port = serverConfig.port || process.env.SERVER_PORT;

  await app.listen(port);
  logger.log(`Application started listening on port ${port}`);
}
bootstrap();
