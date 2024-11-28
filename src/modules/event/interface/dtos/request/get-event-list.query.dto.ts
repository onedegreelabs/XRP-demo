import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CursorPaginationQueryDto } from '@shared/dtos/request/cursor-pagination.query.dto';

export class GetEventListQueryDto extends CursorPaginationQueryDto {
  @ApiProperty({
    description: '검색어',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
