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
import { RegionsService } from './regions.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
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
import { RegionDto } from './dto/region.dto';

@ApiTags('Regions endpoints')
@Controller('regions')
export class RegionsController {
  constructor(private readonly regionService: RegionsService) {}

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
  async createRegion(
    @Body() createCategoryDto: CreateRegionDto,
  ): Promise<SuccessResponseDTO> {
    await this.regionService.createRegion(createCategoryDto);

    return new SuccessResponseDTO();
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: RegionDto,
    isArray: true,
  })
  async findAllRegions(): Promise<RegionDto[]> {
    const regions = await this.regionService.findAllRegions();

    return regions.map((el) => new RegionDto(el));
  }

  @Get(':id')
  @ApiNotFoundResponse({
    description: 'NotFoundError',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: RegionDto,
  })
  async findOneRegion(@Param('id') id: number): Promise<RegionDto> {
    const region = await this.regionService.findOneRegion(+id);

    return new RegionDto(region);
  }

  @Patch(':id')
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
  async updateRegion(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateRegionDto,
  ): Promise<SuccessResponseDTO> {
    await this.regionService.updateRegion(+id, updateCategoryDto);

    return new SuccessResponseDTO();
  }

  @Delete(':id')
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
  async removeRegion(@Param('id') id: string): Promise<SuccessResponseDTO> {
    await this.regionService.removeRegion(+id);

    return new SuccessResponseDTO();
  }
}
