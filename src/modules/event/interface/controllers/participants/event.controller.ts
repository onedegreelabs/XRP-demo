import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateEventRequestBodyDto } from '@event/interface/dtos/request/create-event.body.dto';
import { AuthTokenPayloadDto } from '@user/interface/dtos/common/auth-token-payload.dto';
import { File } from '@shared/decorators/file.request.decorator';
import { plainToInstance } from 'class-transformer';
import { EventCoverImageUpload } from '@shared/decorators/event-cover-image.multer.decorator';
import { EVENT_CONSTRAINTS } from '@event/interface/constants/event.constant';
import { EventDescriptionImageUpload } from '@shared/decorators/event-description-image.multer.decorator';
import { GetS3KeyResponseDto } from '@shared/dtos/response/get-s3-key.response.dto';
import { User } from '@shared/decorators/user.request.decorator';
import { FreeMembership } from '@shared/security/roles/free-membership.role.decorator';
import { CreateEventResponseDto } from '@event/interface/dtos/response/create-event.response.dto';
import { EventFeature } from '@event/application/features/event.feature';
import { GetEventInfoResponseDto } from '@event/interface/dtos/response/get-event-info.response.dto';
import { EventHandleQueryDto } from '@event/interface/dtos/request/event-handle.query.dto';
import { GetEventListQueryDto } from '@event/interface/dtos/request/get-event-list.query.dto';
import { CursorPaginated } from '@shared/types/pagination.type';
import { ExposedGroup } from '@shared/security/groups/exposed-group.decorator';
import { EXPOSED_GROUPS } from '@shared/security/groups/exposed-group.enum';

@ApiTags('Event')
@Controller()
export class EventController {
  constructor(private readonly eventFeature: EventFeature) {}

  // @ApiEvent.GetEventInfo({ summary: '내 이벤트 조회 ✅' })
  // @Get('me/events')
  // @HttpCode(HttpStatus.OK)
  // async getMyEvents(
  //   @Query() { handle }: EventHandleQueryDto,
  // ): Promise<GetEventInfoResponseDto> {
  //   return this.eventFeature.getEventInfo(handle);
  // }

  @Post('events')
  @FreeMembership() // !!! 이벤트 생성은 프로 회원만 가능 (테스트 끝나면 ProMembership 으로 변경)
  @HttpCode(HttpStatus.OK)
  async createEvent(
    @User() payload: AuthTokenPayloadDto,
    @Body() createEventRequestBodyDto: CreateEventRequestBodyDto,
  ): Promise<CreateEventResponseDto> {
    console.log('createEventRequestBodyDto', createEventRequestBodyDto);
    return this.eventFeature.createEvent(
      payload.userId,
      payload.email,
      createEventRequestBodyDto,
    );
  }

  @Post('events/cover-image')
  @FreeMembership()
  @EventCoverImageUpload()
  @HttpCode(HttpStatus.OK)
  async uploadCoverImage(
    @File(EVENT_CONSTRAINTS.COVER_IMAGE_FILE_KEY) image: Express.MulterS3.File,
  ): Promise<GetS3KeyResponseDto> {
    return plainToInstance(GetS3KeyResponseDto, {
      url: image.key ?? null,
      key: image.key ?? null,
    });
  }

  @Post('events/description-image')
  @FreeMembership()
  @EventDescriptionImageUpload()
  @HttpCode(HttpStatus.OK)
  async uploadDescriptionImage(
    @File(EVENT_CONSTRAINTS.DESCRIPTION_IMAGE_FILE_KEY)
    image: Express.MulterS3.File,
  ): Promise<GetS3KeyResponseDto> {
    return plainToInstance(GetS3KeyResponseDto, {
      url: image.key ?? null,
      key: image.key ?? null,
    });
  }

  @Get('events/info')
  @FreeMembership()
  @HttpCode(HttpStatus.OK)
  async getEventInfo(
    @Query() { handle }: EventHandleQueryDto,
  ): Promise<GetEventInfoResponseDto> {
    return this.eventFeature.getEventInfo(handle);
  }

  @Get('events')
  @HttpCode(HttpStatus.OK)
  async getEventList(
    @Query() getEventListQueryDto: GetEventListQueryDto,
  ): Promise<CursorPaginated<GetEventInfoResponseDto>> {
    return this.eventFeature.getEventList(getEventListQueryDto);
  }

  @Get('me/events')
  @HttpCode(HttpStatus.OK)
  @FreeMembership()
  @ExposedGroup([EXPOSED_GROUPS.ME])
  async getMyEvents(
    @User() payload: AuthTokenPayloadDto,
  ): Promise<GetEventInfoResponseDto[]> {
    return this.eventFeature.getMyEvents(payload.userId);
  }
}
