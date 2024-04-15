import { ECondition, ESocialMediaType } from '@prisma/client';

export interface IGetAds {
  uuid: string;
  title: string;
  images: string[];
  price: number;
  subCategory?: {
    category: { name: string };
  };
  city?: { region: { title: string }; title: string };
}

export interface IPublicProfile {
  uuid: string;
  name: string;
  phone: string;
  profileSocialMedia: { network: ESocialMediaType; url: string }[];
  site: string;
  address: string;
  description: string;
  user: { email: string };
  _count?: { ads: number };
}

export interface IGetAd extends IGetAds {
  address: string;
  profile: IPublicProfile;
  description: string;
  features: string[];
  conditions: ECondition;
  brand: string;
  model: string;
  year: string;
  isPriceNegotiable: boolean;
  profileUUID: string;
}
