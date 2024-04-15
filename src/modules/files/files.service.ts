import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from '@aws-sdk/client-s3';
import * as crypto from 'crypto';
import { IFile } from '../../libs/interfaces/file.interface';
import { Upload } from '@aws-sdk/lib-storage';
import { IFileService } from './file';

@Injectable()
export class FilesService implements IFileService {
  private logger: Logger = new Logger(FilesService.name);

  private readonly s3: S3;
  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3({
      apiVersion: 'latest',
      region: configService.get('REGION'),
      endpoint: configService.get('BUCKET_ENDPOINT'),
      credentials: {
        accessKeyId: configService.get('ACCESS_KEY'),
        secretAccessKey: configService.get('SECRET_KEY'),
      },
    });
  }

  async uploadFile({
    dataBuffer,
    fileName,
    contentType,
  }: IFile): Promise<string> {
    try {
      const upload = new Upload({
        client: this.s3,
        params: {
          Bucket: this.configService.get('BUCKET_NAME'),
          Body: dataBuffer,
          Key: `${crypto.randomUUID()}-${fileName}`,
          ContentType: contentType,
        },
      });

      const uploadResult = await upload.done();

      this.logger.debug(`file ${fileName} successfully uploaded  to S3`);

      return uploadResult.Location;
    } catch (e) {
      this.logger.error(e, e.stack);
      throw new BadRequestException('files.upload_failed');
    }
  }
}
