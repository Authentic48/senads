import { CreateCategoryDto } from './dto/create-category.dto';
import { ICategory } from '../../libs/interfaces/category.interface';
import { UpdateCategoryDto } from './dto/update-category.dto';

export interface ICategoryService {
  createCategory({ name }: CreateCategoryDto): Promise<void>;
  findAllCategories(): Promise<ICategory[]>;
  findOneCategory(uuid: string): Promise<ICategory>;
  updateCategory(uuid: string, { name }: UpdateCategoryDto): Promise<void>;
  removeCategory(uuid: string): Promise<void>;
}
