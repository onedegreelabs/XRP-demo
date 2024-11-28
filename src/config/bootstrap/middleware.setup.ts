import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

export function middlewareSetup(app: NestExpressApplication) {
  app.use(helmet());
  app.disable('x-powered-by');
  app.use(cookieParser());
}
