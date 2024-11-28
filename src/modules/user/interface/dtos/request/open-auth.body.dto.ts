import { ApiProperty } from '@nestjs/swagger';
import { ThirdPartyProvider } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class OpenAuthRequestBodyDto {
  @ApiProperty({
    enum: ThirdPartyProvider,
    description: 'Open Auth 제공업체',
  })
  @IsNotEmpty()
  @IsEnum(ThirdPartyProvider)
  provider: ThirdPartyProvider;

  @ApiProperty({
    type: String,
    description: 'Open Auth 코드',
  })
  @IsNotEmpty()
  @IsString()
  code: string;
}
