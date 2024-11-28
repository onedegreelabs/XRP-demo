import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive } from 'class-validator';
import { OffsetPaginationOption } from '@shared/types/pagination.type';

export class OffsetPaginationQueryDto implements OffsetPaginationOption {
  @ApiProperty({
    type: Number,
    description: '요청 개수',
  })
  @IsPositive()
  @IsNotEmpty()
  take: number;

  @ApiProperty({
    type: Number,
    description: '페이지 번호',
  })
  @IsPositive()
  @IsNotEmpty()
  page: number;
}
