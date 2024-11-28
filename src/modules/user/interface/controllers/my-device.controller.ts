import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { UserDeviceFeature } from '@user/application/features/user-device.feature';
import { AuthTokenPayloadDto } from '@user/interface/dtos/common/auth-token-payload.dto';
import { User } from '@shared/decorators/user.request.decorator';
import { UserDeviceParamDto } from '@user/interface/dtos/request/user-device.param.dto';
import { ApiTags } from '@nestjs/swagger';
import { FreeMembership } from '@shared/security/roles/free-membership.role.decorator';
import { GetUserDeviceResponseDto } from '@user/interface/dtos/response/get-user-device.response.dto';

@ApiTags('User')
@Controller('me/devices')
@FreeMembership()
export class MyDeviceController {
  constructor(private readonly userDeviceFeature: UserDeviceFeature) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getMyDevices(
    @User() payload: AuthTokenPayloadDto,
  ): Promise<GetUserDeviceResponseDto[]> {
    return this.userDeviceFeature.getUserDevices(payload.userId);
  }

  @Delete(':deviceId')
  @HttpCode(HttpStatus.OK)
  async unlinkMyDevice(
    @Param() { deviceId }: UserDeviceParamDto,
  ): Promise<void> {
    await this.userDeviceFeature.unlinkUserDevice(deviceId);
  }
}
