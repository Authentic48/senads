import { ApiProperty } from '@nestjs/swagger';
import { IRegion } from '../../../libs/interfaces/region.interface';

export class CityDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  constructor({ id, title }: IRegion) {
    this.id = id;
    this.title = title;
  }
}
