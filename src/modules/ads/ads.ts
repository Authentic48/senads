import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';

export interface IAds {
  createAd(createAdDto: CreateAdDto, userUUID: string): Promise<void>;

  findAllAds(categoryUUID?: string);

  findAdByUUID(uuid: string);

  updateAd(
    uuid: string,
    updateAdDto: UpdateAdDto,
    userUUID: string,
  ): Promise<void>;

  removeAd(uuid: string, userUUID: string): Promise<void>;
}
