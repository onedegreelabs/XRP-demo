import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { transformImageURL } from '@util/index';

export class GetS3KeyResponseDto {
  @ApiProperty({
    type: String,
    description: 'S3 File URL',
    example:
      'https://cdn.glimpse.rsvp/dir/38240339-d1d0-4f22-a811-12cd492d2b1e.png',
  })
  @Transform(({ value }) => transformImageURL(value), {
    toClassOnly: true,
  })
  url: string;

  @ApiProperty({
    type: String,
    description: 'S3 file key',
    example: 'dir/38240339-d1d0-4f22-a811-12cd492d2b1e.png',
  })
  key: string;
}
