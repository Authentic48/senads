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
import { AdsService } from './ads.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { AuthGuard } from '../../libs/guards/auth.guard';
import {
  ApiHeader,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SuccessResponseDTO } from '../../libs/dtos/success-response.dto';
import { UserInfo } from '../../libs/decorators/user-info.decorator';
import { IJWTPayload } from '../../libs/interfaces/user.interface';
import { AdQueryDto } from './dto/ad-query.dto';
import { RecommendedAdsDto } from './dto/recommended-ads.dto';
import { PaginatedResponseDto } from '../../libs/dtos/paginated-response.dto';
import { AdsDto } from './dto/ads.dto';
import { AdDto } from './dto/ad.dto';

@ApiTags('Ads endpoints')
@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiHeader({
    name: 'Access Token',
  })
  @ApiUnauthorizedResponse({
    description: 'UnAuthorized',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successful',
    type: SuccessResponseDTO,
  })
  async create(
    @Body() createAdDto: CreateAdDto,
    @UserInfo() { userUUID }: IJWTPayload,
  ) {
    await this.adsService.createAd(createAdDto, userUUID);

    return new SuccessResponseDTO();
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: AdsDto,
    isArray: true,
  })
  async findAll(
    @Query() adQueryDto: AdQueryDto,
  ): Promise<PaginatedResponseDto<AdsDto>> {
    const [count, result] = await this.adsService.findAllAds(adQueryDto);

    const adDtoList = result.map((el) => new AdsDto(el));

    return new PaginatedResponseDto({
      count,
      limit: adQueryDto.limit,
      offset: adQueryDto.offset,
      data: adDtoList,
    });
  }

  @Get(':uuid')
  @ApiNotFoundResponse({
    description: 'NotFound',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: AdDto,
  })
  async findOne(@Param('uuid') uuid: string) {
    const ad = await this.adsService.findAdByUUID(uuid);
    return new AdDto(ad);
  }

  @Patch(':uuid')
  @UseGuards(AuthGuard)
  @ApiHeader({
    name: 'Access Token',
  })
  @ApiUnauthorizedResponse({
    description: 'UnAuthorized',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: SuccessResponseDTO,
  })
  async update(
    @Param('uuid') uuid: string,
    @Body() updateAdDto: UpdateAdDto,
    @UserInfo() { userUUID }: IJWTPayload,
  ) {
    await this.adsService.updateAd(uuid, updateAdDto, userUUID);

    return new SuccessResponseDTO();
  }

  @Delete(':uuid')
  @UseGuards(AuthGuard)
  @ApiHeader({
    name: 'Access Token',
  })
  @ApiUnauthorizedResponse({
    description: 'UnAuthorized',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: SuccessResponseDTO,
  })
  async remove(
    @Param('uuid') uuid: string,
    @UserInfo() { userUUID }: IJWTPayload,
  ) {
    await this.adsService.removeAd(uuid, userUUID);

    return new SuccessResponseDTO();
  }

  @Get(':uuid/recommendations')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: AdsDto,
    isArray: true,
  })
  async getRecommendedAds(
    @Param('uuid') uuid: string,
    @Query() data: RecommendedAdsDto,
  ): Promise<AdsDto[]> {
    const result = await this.adsService.getRecommendedAds(uuid, data);

    return result.map((el) => new AdsDto(el));
  }
}
