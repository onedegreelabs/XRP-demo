import { Module } from '@nestjs/common';
import { SES, SendRawEmailCommand } from '@aws-sdk/client-ses';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EnvModule } from '@env/env.module';
import { EnvService } from '@env/services/env.service';
import { ENVIRONMENT_KEY } from '@env/variables';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    EnvModule,
    MailerModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (configService: EnvService) => ({
        transport: {
          SES: {
            ses: new SES({
              region: configService.get<string>(ENVIRONMENT_KEY.SES_REGION),
              credentials: {
                accessKeyId: configService.get<string>(
                  ENVIRONMENT_KEY.SES_ACCESS_KEY,
                ),
                secretAccessKey: configService.get<string>(
                  ENVIRONMENT_KEY.SES_SECRET_KEY,
                ),
              },
            }),
            aws: { SendRawEmailCommand },
          },
          secure: false,
          ignoreTLS: true,
          requireTLS: false,
        },
        defaults: {
          from: `Glimpse <no-reply@${configService.get<string>(
            ENVIRONMENT_KEY.SES_DOMAIN,
          )}>`,
        },
        template: {
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
})
export class NodeMailerModule {}
