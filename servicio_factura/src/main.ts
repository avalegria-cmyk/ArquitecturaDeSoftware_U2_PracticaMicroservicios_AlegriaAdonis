import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //prefijo que permite identidicar que se se trata de una api/servicio
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3003);
}
await bootstrap();
