import { Injectable } from '@nestjs/common';
import { CreateImageToJsonDto } from './dto/create-image-to-json.dto';
import { main } from '../tools/imageToJson';

@Injectable()
export class ImageToJsonService {

  // convert image to json
  async imageToJson(file: Express.Multer.File) {
    console.log(file);
    const result = await main(file.filename);
    return result;
  }

  // create(createImageToJsonDto: CreateImageToJsonDto) {
  //   return 'This action adds a new imageToJson';
  // }

  // findAll() {
  //   return `This action returns all imageToJson`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} imageToJson`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} imageToJson`;
  // }
}
