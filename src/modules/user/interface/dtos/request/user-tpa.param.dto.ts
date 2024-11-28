import { IsNotEmpty, IsString } from 'class-validator';

export class UserTpaParamDto {
  @IsNotEmpty()
  @IsString()
  tpaId: string;
}
