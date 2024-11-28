import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EventHandleQueryDto {
  @ApiProperty({
    type: String,
    description: '핸들',
  })
  @IsNotEmpty()
  @IsString()
  handle: string;
}
