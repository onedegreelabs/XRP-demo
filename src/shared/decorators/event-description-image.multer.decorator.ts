import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { MulterInterceptor } from '@interceptor/multer.interceptor';
import { IMAGE_MIME_TYPES } from '@config/multer/multer.type';
import { EVENT_CONSTRAINTS } from '@event/interface/constants/event.constant';

export function EventDescriptionImageUpload() {
  return applyDecorators(
    UseInterceptors(
      MulterInterceptor(
        [
          {
            name: EVENT_CONSTRAINTS.DESCRIPTION_IMAGE_FILE_KEY,
            maxCount: EVENT_CONSTRAINTS.DESCRIPTION_IMAGE_MAX_COUNT,
          },
        ],
        {
          saveDir: EVENT_CONSTRAINTS.DESCRIPTION_IMAGE_SAVE_DIR,
          fileSize: EVENT_CONSTRAINTS.DESCRIPTION_IMAGE_MAX_SIZE,
          allowedMimeTypes: IMAGE_MIME_TYPES,
        },
      ),
    ),
  );
}
