import { Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { InternalServerErrorException } from '@exception/custom/internal-server-error.exception';
import { MailExceptionEnum } from '@exception/enum/mail.enum';
import { join } from 'path';
import { MailService } from '@mailer/services/mail.service';

@Injectable()
export class NodeMailerService implements MailService {
  constructor(private readonly mailerService: MailerService) {}

  async send(options: ISendMailOptions): Promise<void> {
    try {
      await this.mailerService.sendMail(options);
    } catch (err) {
      throw new InternalServerErrorException(
        MailExceptionEnum.MailClientRequestError,
      );
    }
  }

  getTemplateName(str: string): string {
    const saveDir = join(__dirname, '../templates');

    const kebabCase = str
      .replace(/([a-z])([A-Z])/g, '$1-$2') // 소문자와 대문자 사이에 하이픈을 추가
      .toLowerCase(); // 모두 소문자로 변환

    return join(saveDir, `${kebabCase}.hbs`);
  }
}
