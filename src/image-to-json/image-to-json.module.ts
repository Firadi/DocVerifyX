import { Module } from '@nestjs/common';
import { ImageToJsonService } from './image-to-json.service';
import { ImageToJsonController } from './image-to-json.controller';

@Module({
  controllers: [ImageToJsonController],
  providers: [ImageToJsonService],
})
export class ImageToJsonModule {}
