import { ISendMailOptions } from '@nestjs-modules/mailer';

export abstract class MailService {
  abstract send(options: ISendMailOptions): Promise<void>;
  abstract getTemplateName(str: string): string;
}
