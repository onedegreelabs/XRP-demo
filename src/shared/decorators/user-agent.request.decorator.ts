import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UAParser } from 'ua-parser-js';
import { plainToInstance } from 'class-transformer';
import { UserAgentDto } from '@user/interface/dtos/common/user-agent.dto';
import { DeviceType } from '@prisma/client';

export const UserAgent = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const userAgent = request.headers['user-agent'];

    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    return plainToInstance(UserAgentDto, {
      browserName: result.browser.name,
      browserVersion: result.browser.version,
      osName: result.os.name,
      osVersion: result.os.version,
      type: (result.device.type || 'desktop').toUpperCase() as DeviceType,
      platform: result.cpu.architecture,
    });
  },
);
