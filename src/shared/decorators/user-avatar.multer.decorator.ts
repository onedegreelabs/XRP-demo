import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { MulterInterceptor } from '@interceptor/multer.interceptor';
import { USER_CONSTRAINTS } from '@user/interface/constants/user.constant';
import { IMAGE_MIME_TYPES } from '@config/multer/multer.type';

export function UserAvatarUpload() {
  return applyDecorators(
    UseInterceptors(
      MulterInterceptor(
        [
          {
            name: USER_CONSTRAINTS.AVATAR_FILE_KEY,
            maxCount: USER_CONSTRAINTS.AVATAR_MAX_COUNT,
          },
        ],
        {
          saveDir: USER_CONSTRAINTS.AVATAR_SAVE_DIR,
          fileSize: USER_CONSTRAINTS.AVATAR_MAX_SIZE,
          allowedMimeTypes: IMAGE_MIME_TYPES,
        },
      ),
    ),
  );
}
