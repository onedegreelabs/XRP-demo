import { Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { InternalServerErrorException } from '@exception/custom/internal-server-error.exception';
import { GlobalExceptionEnum } from '@exception/enum/global.enum';
import { MulterBuilder } from '@config/multer/multer.builder';
import { v4 as uuidv4 } from 'uuid';
import { S3ObjectDto } from '@persistence/s3/s3-object.dto';

@Injectable()
export class AwsS3Service extends MulterBuilder {
  constructor() {
    super();
  }

  /**
   * * 파일 업로드 (multer 미사용 시)
   * * multer를 사용하지 않고 직접 파일을 업로드할 때 사용
   * * 이 함수는 다중 업로드 지원하지 않음.
   *
   * @param file - Express.Multer.File
   * @param path - 저장될 directory path
   * @example
   * ```ts
   * @Post('upload')
   * @UseInterceptors(FileInterceptor('file'))
   * async uploadFile(@UploadedFile() file: Express.Multer.File) {
   *    return this.awsS3Service.upload(file, 'image', 'example');
   * }
   * ```
   */
  async uploadImage(
    file: Express.Multer.File,
    path: string,
  ): Promise<S3ObjectDto> {
    const ext = file.originalname.split('.').pop().toLowerCase();
    const key = `${path}/${uuidv4()}.${ext}`;

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });
      await this.s3.send(command);

      return new S3ObjectDto(key);
    } catch (e) {
      throw new InternalServerErrorException(
        GlobalExceptionEnum.AwsS3ClientRequestError,
      );
    }
  }

  /**
   * 파일 업로드 시 메타데이터 추가
   * @param data
   * @param saveDir
   */
  async uploadJson(data: string, saveDir: string): Promise<S3ObjectDto> {
    const key = `${saveDir}/${uuidv4()}.json`;

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: data,
        ContentType: 'application/json',
      });
      await this.s3.send(command);

      return new S3ObjectDto(key);
    } catch (e) {
      throw new InternalServerErrorException(
        GlobalExceptionEnum.AwsS3ClientRequestError,
      );
    }
  }

  async delete(object: S3ObjectDto): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: object.key,
      });
      await this.s3.send(command);
    } catch (e) {
      throw new InternalServerErrorException(
        GlobalExceptionEnum.AwsS3ClientRequestError,
      );
    }
  }

  /**
   * * 한 번에 여러 파일을 삭제할 때 사용합니다.
   *
   * @param objects
   */
  async deleteMany(objects: S3ObjectDto[]): Promise<void> {
    try {
      const command = new DeleteObjectsCommand({
        Bucket: this.bucketName,
        Delete: {
          Objects: objects.map((object) => {
            return { Key: object.key };
          }),
        },
      });
      await this.s3.send(command);
    } catch (e) {
      throw new InternalServerErrorException(
        GlobalExceptionEnum.AwsS3ClientRequestError,
      );
    }
  }
}
