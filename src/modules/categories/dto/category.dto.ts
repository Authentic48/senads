import { ApiProperty } from '@nestjs/swagger';
import { ICategory } from '../../../libs/interfaces/category.interface';

export class CategoryDto {
  @ApiProperty()
  uuid: string;

  @ApiProperty()
  name: string;

  constructor({ uuid, name }: ICategory) {
    this.uuid = uuid;
    this.name = name;
  }
}
