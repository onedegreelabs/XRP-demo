import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ResponseFormatInterceptor } from '@interceptor/response-format.interceptor';
import { LoggerMiddleware } from '@middleware/logger.middleware';
import { UserModule } from '@user/user.module';
import { PrismaModule } from '@persistence/prisma/prisma.module';
import { CacheModule } from '@cache/cache.module';
import { EnvModule } from '@env/env.module';
import { MailerModule } from '@mailer/mailer.module';
import { AwsS3Module } from '@persistence/s3/aws-s3.module';
import { JwtAuthModule } from '@jwt/jwt.module';
import { EventModule } from '@event/event.module';
import { SecurityModule } from '@shared/security/security.module';
import { CryptoModule } from '@config/crypto/crypto.module';
import { QueueModule } from '@config/queue/queue.module';
import { ViewModule } from '@views/view.module';

@Module({
  imports: [
    SecurityModule,
    UserModule,
    EventModule,
    PrismaModule,
    CacheModule,
    EnvModule,
    MailerModule,
    AwsS3Module,
    JwtAuthModule,
    CryptoModule,
    QueueModule,
    ViewModule,
  ],
  providers: [ResponseFormatInterceptor],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
