import {
  ValidationPipe,
} from '@nestjs/common';

import {
  NestFactory,
} from '@nestjs/core';

import {
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';

import {
  AppModule,
} from './app.module';

import {
  HttpExceptionFilter,
} from './common/http-exception.filter';

async function bootstrap() {

  const app =
    await NestFactory.create(
      AppModule,
    );

  app.enableCors(
    {
      origin:
        'http://localhost:3001',
    },
  );

  app.useGlobalPipes(
    new ValidationPipe(
      {
        whitelist:
          true,

        transform:
          true,

        forbidNonWhitelisted:
          true,
      },
    ),
  );

  app.useGlobalFilters(
    new HttpExceptionFilter(),
  );

  const swaggerConfig =
    new DocumentBuilder()
      .setTitle(
        'Smart Queue Management System',
      )
      .setDescription(
        'SQMS REST API',
      )
      .setVersion(
        '1.0',
      )
      .addBearerAuth()
      .build();

  const swaggerDocument =
    SwaggerModule.createDocument(
      app,
      swaggerConfig,
    );

  SwaggerModule.setup(
    'api',
    app,
    swaggerDocument,
  );

  const port =
    process.env.PORT ??
    3000;

  await app.listen(
    port,
  );

  console.log(
    `Application running on http://localhost:${port}`,
  );

  console.log(
    `Swagger running on http://localhost:${port}/api`,
  );
}

bootstrap();