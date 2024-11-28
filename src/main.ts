import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '@app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { EnvService } from '@env/services/env.service';
import { ENVIRONMENT_KEY } from '@env/variables';
import { corsSetup } from '@bootstrap/cors.setup';
import { globalsSetup } from '@bootstrap/globals.setup';
import { middlewareSetup } from '@config/bootstrap/middleware.setup';
import { join } from 'path';
import * as hbs from 'hbs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  middlewareSetup(app);
  corsSetup(app);
  globalsSetup(app);

  // HBS 설정
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'public', 'pages'));
  app.setViewEngine('hbs');
  hbs.registerPartials(join(__dirname, '..', 'public', 'pages', 'partials'));
  app.use((req, res, next) => {
    res.setHeader(
      'Content-Security-Policy',
      "script-src 'self' https://kit.fontawesome.com https://cdn.jsdelivr.net;",
    );
    next();
  });

  const env = app.get<EnvService>(EnvService);
  const PORT = env.get<number>(ENVIRONMENT_KEY.PORT) || 8080;
  Logger.log(`🐥 Server is Running on PORT ${PORT}! 🐥`);

  await app.listen(PORT, '0.0.0.0');
}
bootstrap().then();
