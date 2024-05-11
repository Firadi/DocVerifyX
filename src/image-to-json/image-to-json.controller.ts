import { Controller, Post, UseInterceptors, UploadedFile, HttpException, HttpStatus } from '@nestjs/common';
import { ImageToJsonService } from './image-to-json.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/tools/multer.config';

@Controller('image-to-json')
export class ImageToJsonController {
  constructor(private readonly imageToJsonService: ImageToJsonService) {}

  // convert image to json
  @Post()
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async imageToJson( @UploadedFile() file: Express.Multer.File) {
    const result = await this.imageToJsonService.imageToJson(file);
    if (result)
      return result;
    throw new HttpException('Invalid image', HttpStatus.BAD_REQUEST);

  }
}
