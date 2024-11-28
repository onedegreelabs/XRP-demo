import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsPositive } from 'class-validator';
import { CursorPaginationOption } from '@shared/types/pagination.type';

export class CursorPaginationQueryDto implements CursorPaginationOption {
  @ApiProperty({
    type: Number,
    description: '반환되는 결과의 개수',
    required: true,
  })
  @IsPositive()
  @IsNotEmpty()
  take: number;

  @ApiProperty({
    type: Number,
    description: '반환된 Items의 마지막 id ( 첫 조회 이후 )',
    required: false,
  })
  @IsPositive()
  @IsOptional()
  cursorId: string;
}
