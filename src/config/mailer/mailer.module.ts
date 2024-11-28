import { Global, Module } from '@nestjs/common';
import { NodeMailerModule } from '@mailer/node-mailer/node-mailer.module';
import { MailService } from '@mailer/services/mail.service';
import { NodeMailerService } from '@mailer/node-mailer/node-mailer.service';

@Global()
@Module({
  imports: [NodeMailerModule],
  providers: [
    {
      provide: MailService,
      useClass: NodeMailerService,
    },
  ],
  exports: [MailService],
})
export class MailerModule {}
