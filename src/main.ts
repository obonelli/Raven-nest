import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔐 CORS (CORS_ORIGINS="https://foo.com,https://bar.com"; "*" para permitir todos)
  const corsList = (process.env.CORS_ORIGINS || '*')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  app.enableCors({
    origin: corsList.length === 1 && corsList[0] === '*' ? true : corsList,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // 🧹 Global pipes (validations & transformations)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // 📘 Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('🦅 Raven Nest API')
    .setDescription('Demo backend con NestJS + TypeORM + Supabase')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // ⚙️ Server port
  const port = Number(process.env.PORT || 4000);
  await app.listen(port);

  console.log(`\n🚀 Server running → http://localhost:${port}`);
  console.log(`📗 Swagger docs → http://localhost:${port}/docs\n`);
}

bootstrap();
