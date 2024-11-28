import { IsNotEmpty, IsString } from 'class-validator';

export class UserHandleQueryDto {
  @IsNotEmpty()
  @IsString()
  handle: string;
}
