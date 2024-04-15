import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { ICategory } from '../../libs/interfaces/category.interface';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';

export interface ISubCategoriesService {
  createSubCategory(
    uuid: string,
    { name }: CreateSubCategoryDto,
  ): Promise<void>;
  findAllSubCategories(categoryUUID: string): Promise<ICategory[]>;
  findOneSubCategory(uuid: string): Promise<ICategory>;
  updateSubCategory(
    uuid: string,
    { name }: UpdateSubCategoryDto,
  ): Promise<void>;
  removeSubCategory(uuid: string): Promise<void>;
}
