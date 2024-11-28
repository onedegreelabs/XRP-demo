import { NestExpressApplication } from '@nestjs/platform-express';

export function corsSetup(app: NestExpressApplication) {
  app.enableCors({
    origin: true,
    credentials: true,
    exposedHeaders: ['Content-Type', 'Content-Disposition', 'Content-Location'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });
}
