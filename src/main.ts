import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Request, Response } from 'express'; // for typing the custom route handler

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🌐 Enable CORS with dynamic origins from environment variable
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

  // 🧹 Global pipes for validation and transformation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // 📘 Swagger configuration with JWT Bearer authentication
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
      'access-token', // security scheme name
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // 🧩 Serve a custom JS for auto-authorization after /auth/login
  const customJsPath = '/swagger-custom.js';
  const http = app.getHttpAdapter().getInstance(); // Express app instance

  http.get(customJsPath, (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.send(`
(function () {
  // Try to preauthorize using token stored in localStorage when Swagger UI loads
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

  // Intercept fetch requests to detect /auth/login responses and auto-save the token
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
              // Save token locally and preauthorize automatically
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

  // ⚙️ Setup Swagger UI with persistence and injected JS
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // keeps token after refresh
      docExpansion: 'list',
    },
    customJs: customJsPath, // injects the custom script
    customSiteTitle: 'Raven Nest API • Docs',
  });

  // 🚀 Start server
  const port = Number(process.env.PORT || 4000);
  await app.listen(port);
  console.log(`\n🚀 Server running → http://localhost:${port}`);
  console.log(`📗 Swagger docs → http://localhost:${port}/docs\n`);
}

bootstrap();
