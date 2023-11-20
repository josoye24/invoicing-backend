import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3001); // get port from env else use 3001
  app.enableCors();
  app.setGlobalPrefix('api');
  await app.listen(port);
}
bootstrap();
