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
  Query,
} from '@nestjs/common';
import { SubCategoriesService } from './sub-categories.service';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
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
import { SubCategoryDto } from './dto/sub-category.dto';
import { SubCategoryQueryDto } from './dto/sub-category-query.dto';

@ApiTags('SubCategories - Ads subCategories endpoints')
@Controller('categories/:uuid/sub-categories')
export class SubCategoriesController {
  constructor(private readonly subCategoriesService: SubCategoriesService) {}

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
  async createSubCategory(
    @Param('uuid') uuid: string,
    @Body() createCategoryDto: CreateSubCategoryDto,
  ): Promise<SuccessResponseDTO> {
    await this.subCategoriesService.createSubCategory(uuid, createCategoryDto);

    return new SuccessResponseDTO();
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: SubCategoryDto,
    isArray: true,
  })
  async findAllCategories(
    @Query() { categoryUUID }: SubCategoryQueryDto,
  ): Promise<SubCategoryDto[]> {
    const subCategories = await this.subCategoriesService.findAllSubCategories(
      categoryUUID,
    );

    return subCategories.map((el) => new SubCategoryDto(el));
  }

  @Get(':subCategoryUUID')
  @ApiNotFoundResponse({
    description: 'NotFoundError',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: SubCategoryDto,
  })
  async findOneSubCategory(
    @Param('subCategoryUUID') uuid: string,
  ): Promise<SubCategoryDto> {
    const subCategory = await this.subCategoriesService.findOneSubCategory(
      uuid,
    );

    return new SubCategoryDto(subCategory);
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
  async updateSubCategory(
    @Param('uuid') uuid: string,
    @Body() updateCategoryDto: UpdateSubCategoryDto,
  ): Promise<SuccessResponseDTO> {
    await this.subCategoriesService.updateSubCategory(uuid, updateCategoryDto);

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
  async removeSubCategory(
    @Param('uuid') uuid: string,
  ): Promise<SuccessResponseDTO> {
    await this.subCategoriesService.removeSubCategory(uuid);

    return new SuccessResponseDTO();
  }
}
