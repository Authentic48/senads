import { CreateCityDto } from './dto/create-city.dto';
import { IRegion } from '../../libs/interfaces/region.interface';
import { UpdateCityDto } from './dto/update-city.dto';

export interface ICityService {
  createCity(regionID: number, { title }: CreateCityDto): Promise<void>;
  findAllCities(regionID: number): Promise<IRegion[]>;
  findOneCity(id: number): Promise<IRegion>;
  updateCity(id: number, { title }: UpdateCityDto): Promise<void>;
  removeCity(id: number): Promise<void>;
}
