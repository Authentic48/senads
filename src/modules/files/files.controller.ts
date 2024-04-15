import {
  Controller,
  FileTypeValidator,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../../libs/guards/auth.guard';
import { SuccessUploadDto } from './dtos/success-upload.dto';

@ApiTags('Files - files uploader endpoints')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(AuthGuard)
  @ApiHeader({
    name: 'Access Token',
  })
  @ApiUnauthorizedResponse({
    description: 'UnAuthorized',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successful',
    type: SuccessUploadDto,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: /.(jpg|jpeg|png)$/,
          }),
          new MaxFileSizeValidator({
            maxSize: 10485760,
          }),
        ],
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    image: Express.Multer.File,
  ): Promise<SuccessUploadDto> {
    const url = await this.filesService.uploadFile({
      fileName: image.originalname,
      dataBuffer: image.buffer,
      fileSize: image.size,
      contentType: image.mimetype,
    });

    return new SuccessUploadDto(url);
  }
}
