import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateEventSettingDto {
  @Expose()
  registrationEnabled: boolean;

  @Expose()
  registrationCapacity: number;

  @Expose()
  waitlistEnabled: boolean;

  @Expose()
  waitlitistCapacity: number;
}
