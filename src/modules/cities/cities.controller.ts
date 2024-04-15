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
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
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
import { CityDto } from './dto/city.dto';

@ApiTags('Cities endpoints')
@Controller('regions/:id/cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

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
    @Param('id') id: string,
    @Body() createCategoryDto: CreateCityDto,
  ): Promise<SuccessResponseDTO> {
    await this.citiesService.createCity(+id, createCategoryDto);

    return new SuccessResponseDTO();
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: CityDto,
    isArray: true,
  })
  async findAllRegions(@Param('id') id: string): Promise<CityDto[]> {
    const cities = await this.citiesService.findAllCities(+id);

    return cities.map((el) => new CityDto(el));
  }

  @Get(':cityID')
  @ApiNotFoundResponse({
    description: 'NotFoundError',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: CityDto,
  })
  async findOneRegion(@Param('cityID') id: string): Promise<CityDto> {
    const city = await this.citiesService.findOneCity(+id);

    return new CityDto(city);
  }

  @Patch(':cityID')
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
    @Param('cityID') id: string,
    @Body() updateCategoryDto: UpdateCityDto,
  ): Promise<SuccessResponseDTO> {
    await this.citiesService.updateCity(+id, updateCategoryDto);

    return new SuccessResponseDTO();
  }

  @Delete(':cityID')
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
  async removeRegion(@Param('cityID') id: string): Promise<SuccessResponseDTO> {
    await this.citiesService.removeCity(+id);

    return new SuccessResponseDTO();
  }
}
