import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './libs/interceptors/transform.interceptor';
import { ErrorFilter } from './libs/filters/error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.useGlobalFilters(new ErrorFilter());

  app.useGlobalInterceptors(new TransformInterceptor());

  app.setGlobalPrefix('api');

  const configService = app.get<ConfigService>(ConfigService);
  const port = parseInt(configService.get('APP_PORT'));

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  app.enableCors();
  app.enableShutdownHooks();

  if (process.env.NODE_ENV !== 'production') {
    setupOpenApi(app);
  }

  await app.listen(port);
}
bootstrap();

function setupOpenApi(app: INestApplication) {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('SENADS - Api documentation')
    .setDescription('Api description of SENADS')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/api/docs', app, document);
}
