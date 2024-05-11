import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImageToJsonModule } from './image-to-json/image-to-json.module';
import { join } from 'path';


@Module({
  imports: [
    ImageToJsonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
}) 
export class AppModule {}
