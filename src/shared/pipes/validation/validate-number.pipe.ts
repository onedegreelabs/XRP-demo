import { Injectable, PipeTransform } from '@nestjs/common';
import { BadRequestException } from '@exception/custom/bad-request.exception';
import { GlobalExceptionEnum } from '@exception/enum/global.enum';

@Injectable()
export class ValidateNumberPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    const parsedValue = parseInt(value, 10);

    if (isNaN(parsedValue)) {
      throw new BadRequestException(GlobalExceptionEnum.NotInNumberFormat);
    }

    return parsedValue;
  }
}
