import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { AdQueryDto } from './dto/ad-query.dto';
import { RecommendedAdsDto } from './dto/recommended-ads.dto';

export interface IAds {
  createAd(createAdDto: CreateAdDto, userUUID: string): Promise<void>;

  findAllAds(adQueryDto: AdQueryDto);

  findAdByUUID(uuid: string);

  updateAd(
    uuid: string,
    updateAdDto: UpdateAdDto,
    userUUID: string,
  ): Promise<void>;

  removeAd(uuid: string, userUUID: string): Promise<void>;

  getRecommendedAds(uuid: string, data: RecommendedAdsDto);
}
