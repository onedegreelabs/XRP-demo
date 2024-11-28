import { Injectable } from '@nestjs/common';
import { UserDeviceService } from '@user/application/services/user-device.service';
import { GetUserDeviceResponseDto } from '@user/interface/dtos/response/get-user-device.response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserDeviceFeature {
  constructor(private readonly userDeviceService: UserDeviceService) {}

  async getUserDevices(userId: string): Promise<GetUserDeviceResponseDto[]> {
    const foundUserDevices =
      await this.userDeviceService.getUserDevices(userId);
    return plainToInstance(GetUserDeviceResponseDto, foundUserDevices);
  }

  async unlinkUserDevice(id: string): Promise<void> {
    await this.userDeviceService.deleteUserDevice(id);
  }
}
