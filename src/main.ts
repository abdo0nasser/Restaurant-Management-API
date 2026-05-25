import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Restaurant API')
    .setDescription(
      'Restaurant management platform API. <br/>' +
        '- Browse and manage restaurants <br/>' +
        '- User authentication & profiles <br/>' +
        '- Follow restaurants and get personalized recommendations <br/>' +
        '- Find nearby restaurants using geospatial queries',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token from /auth/login or /auth/signup',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'Authentication endpoints (signup & login)')
    .addTag('Users', 'User management & restaurant following')
    .addTag('Restaurants', 'Restaurant CRUD & geospatial search')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}
bootstrap();
