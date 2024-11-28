import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EventParamDto {
  @ApiProperty({
    type: String,
    description: '이벤트 ID',
  })
  @IsNotEmpty()
  @IsString()
  eventId: string;
}
