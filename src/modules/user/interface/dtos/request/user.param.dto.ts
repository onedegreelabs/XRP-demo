import { IsNotEmpty, IsString } from 'class-validator';

export class UserParamDto {
  @IsNotEmpty()
  @IsString()
  userId: string;
}
