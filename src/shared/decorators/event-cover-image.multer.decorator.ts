import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { MulterInterceptor } from '@interceptor/multer.interceptor';
import { IMAGE_MIME_TYPES } from '@config/multer/multer.type';
import { EVENT_CONSTRAINTS } from '@event/interface/constants/event.constant';

export function EventCoverImageUpload() {
  return applyDecorators(
    UseInterceptors(
      MulterInterceptor(
        [
          {
            name: EVENT_CONSTRAINTS.COVER_IMAGE_FILE_KEY,
            maxCount: EVENT_CONSTRAINTS.COVER_IMAGE_MAX_COUNT,
          },
        ],
        {
          saveDir: EVENT_CONSTRAINTS.COVER_IMAGE_SAVE_DIR,
          fileSize: EVENT_CONSTRAINTS.COVER_IMAGE_MAX_SIZE,
          allowedMimeTypes: IMAGE_MIME_TYPES,
        },
      ),
    ),
  );
}
