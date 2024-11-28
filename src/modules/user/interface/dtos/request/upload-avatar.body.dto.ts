import { IsNotEmpty, IsString } from 'class-validator';

export class UploadAvatarBodyDto {
  @IsNotEmpty()
  @IsString()
  image: string;
}
