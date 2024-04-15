import { CreateRegionDto } from './dto/create-region.dto';
import { IRegion } from '../../libs/interfaces/region.interface';
import { UpdateRegionDto } from './dto/update-region.dto';

export interface IRegionService {
  createRegion({ title }: CreateRegionDto): Promise<void>;
  findAllRegions(): Promise<IRegion[]>;
  findOneRegion(id: number): Promise<IRegion>;
  updateRegion(id: number, { title }: UpdateRegionDto): Promise<void>;
  removeRegion(id: number): Promise<void>;
}
