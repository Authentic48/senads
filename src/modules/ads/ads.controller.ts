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
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SuccessResponseDTO } from '../../libs/dtos/success-response.dto';
import { UserInfo } from '../../libs/decorators/user-info.decorator';
import { IJWTPayload } from '../../libs/interfaces/user.interface';

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
  async findAll(@Query() subCategoryUUID: string) {
    return this.adsService.findAllAds(subCategoryUUID);
  }

  @Get(':uuid')
  async findOne(@Param('uuid') uuid: string) {
    return this.adsService.findAdByUUID(uuid);
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
}
