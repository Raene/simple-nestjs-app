import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  app.enableCors({
    origin: configService.get('CORS_ORIGIN') || '*',
  });
  app.use(helmet());
  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      skipMissingProperties: true,
    }),
  );
  const swaggerConfig = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Node Log API')
    .setDescription('API to store Node Log data')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('apis', app, document);
  await app.listen(8080);
}
bootstrap();
