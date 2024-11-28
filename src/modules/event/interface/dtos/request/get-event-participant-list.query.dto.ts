import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { OffsetPaginationQueryDto } from '@shared/dtos/request/offset-pagination.query.dto';

export class GetEventParticipantListQueryDto extends OffsetPaginationQueryDto {
  @ApiProperty({
    description: '검색어',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
