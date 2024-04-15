import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { SuccessResponseDTO } from '../../libs/dtos/success-response.dto';
import {
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ERole } from '@prisma/client';
import { Roles } from '../../libs/decorators/role.decorator';
import { RoleGuard } from '../../libs/guards/role.guard';
import { CategoryDto } from './dto/category.dto';

@ApiTags('Categories - Ads categories endpoints')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(RoleGuard)
  @Roles(ERole.BUSINESS)
  @ApiHeader({
    name: 'Access Token',
  })
  @ApiUnauthorizedResponse({
    description: 'UnAuthorized',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  @ApiConflictResponse({
    description: 'Conflict',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successful',
    type: SuccessResponseDTO,
  })
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<SuccessResponseDTO> {
    await this.categoriesService.createCategory(createCategoryDto);

    return new SuccessResponseDTO();
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: CategoryDto,
    isArray: true,
  })
  async findAllCategories(): Promise<CategoryDto[]> {
    const categories = await this.categoriesService.findAllCategories();

    return categories.map((el) => new CategoryDto(el));
  }

  @Get(':uuid')
  @ApiNotFoundResponse({
    description: 'NotFoundError',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: CategoryDto,
  })
  async findOneCategory(@Param('uuid') uuid: string): Promise<CategoryDto> {
    const category = await this.categoriesService.findOneCategory(uuid);

    return new CategoryDto(category);
  }

  @Patch(':uuid')
  @UseGuards(RoleGuard)
  @Roles(ERole.BUSINESS)
  @ApiHeader({
    name: 'Access Token',
  })
  @ApiUnauthorizedResponse({
    description: 'UnAuthorized',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  @ApiNotFoundResponse({
    description: 'NotFoundError',
  })
  @ApiConflictResponse({
    description: 'Conflict',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: SuccessResponseDTO,
  })
  async updateCategory(
    @Param('uuid') uuid: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<SuccessResponseDTO> {
    await this.categoriesService.updateCategory(uuid, updateCategoryDto);

    return new SuccessResponseDTO();
  }

  @Delete(':uuid')
  @UseGuards(RoleGuard)
  @Roles(ERole.BUSINESS)
  @ApiHeader({
    name: 'Access Token',
  })
  @ApiUnauthorizedResponse({
    description: 'UnAuthorized',
  })
  @ApiNotFoundResponse({
    description: 'NotFoundError',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  @ApiConflictResponse({
    description: 'Conflict',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: SuccessResponseDTO,
  })
  async removeCategory(
    @Param('uuid') uuid: string,
  ): Promise<SuccessResponseDTO> {
    await this.categoriesService.removeCategory(uuid);

    return new SuccessResponseDTO();
  }
}
