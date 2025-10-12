// OpenTelemetry (Splunk Observability) must be initialized BEFORE anything else
import './otel.init';

import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🌐 Enable CORS with dynamic origins from env variable
  const corsList = (process.env.CORS_ORIGINS || '*')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  app.enableCors({
    origin: corsList.length === 1 && corsList[0] === '*' ? true : corsList,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // 🛡️ Basic security middleware
  app.use(helmet());

  // 🧹 Global validation and transformation for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove unknown properties
      forbidNonWhitelisted: true, // throw error if extra props are sent
      transform: true, // auto-transform payloads to DTO types
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // 📘 Swagger setup with JWT bearer authentication
  const config = new DocumentBuilder()
    .setTitle('🦅 Raven Nest API')
    .setDescription('Demo backend built with NestJS + TypeORM + Supabase')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'JWT session token',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // 🧩 Custom script to auto-login and persist token in Swagger UI
  const customJsPath = '/swagger-custom.js';
  const http = app.getHttpAdapter().getInstance();

  http.get(customJsPath, (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.send(`
(function () {
  // Preauthorize using token from localStorage
  function preauthFromStorage() {
    try {
      var t = localStorage.getItem('raven_token');
      if (t && window.ui) {
        try { window.ui.preauthorizeApiKey('access-token', t); }
        catch(e){ try{ window.ui.preauthorizeApiKey('access-token', 'Bearer ' + t); }catch(_){} }
      }
    } catch (_) {}
  }
  preauthFromStorage();

  // Intercept fetch to detect /auth/login responses and auto-save token
  var _fetch = window.fetch;
  window.fetch = function() {
    return _fetch.apply(this, arguments).then(function(res){
      try {
        var req = arguments[0];
        var url = (typeof req === 'string') ? req : req.url;
        var method = (arguments[1] && arguments[1].method) || (typeof req !== 'string' ? req.method : 'GET');
        if (url && url.indexOf('/auth/login') !== -1 && (method||'GET').toUpperCase() === 'POST') {
          res.clone().json().then(function(data){
            var token = data && (data.access_token || data.token);
            if (token) {
              try { localStorage.setItem('raven_token', token); } catch(_){}
              if (window.ui) {
                try { window.ui.preauthorizeApiKey('access-token', token); }
                catch(e){ try{ window.ui.preauthorizeApiKey('access-token', 'Bearer ' + token); }catch(_){} }
              }
            }
          }).catch(function(){});
        }
      } catch (_) {}
      return res;
    });
  };
})();`);
  });

  // ⚙️ Swagger UI configuration
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // keep JWT after refresh
      docExpansion: 'list',
    },
    customJs: customJsPath,
    customSiteTitle: 'Raven Nest API • Docs',
  });

  // 🚀 Start server
  const port = Number(process.env.PORT || 4000);
  await app.listen(port);
  console.log(`\n🚀 Server running → http://localhost:${port}`);
  console.log(`📗 Swagger docs → http://localhost:${port}/docs\n`);
}

bootstrap();
