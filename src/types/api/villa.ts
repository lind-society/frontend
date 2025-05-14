import { AdditionalItem, Facilities, Features, Icon, PlaceNearby } from "./global";

import { Currency } from "./currency";
import { Owner } from "./owner";
import { Review } from "./review";

interface Policy {
  pivotId: string;
  id: string;
  name: string;
  typeId: string;
  description: string;
  icon: Icon;
  createdAt: string;
  updatedAt: string;
}

export interface Villa {
  id: string;
  name: string;
  secondaryName: string;
  availability: {
    daily: boolean;
    monthly: boolean;
    yearly: boolean;
  };
  dailyPrice: number;
  lowSeasonDailyPrice: number;
  highSeasonDailyPrice: number;
  peakSeasonDailyPrice: number;
  priceMonthly: number;
  priceYearly: number;
  discountMonthly: number;
  discountYearly: number;
  dailyPriceAfterDiscount: number;
  lowSeasonDailyPriceAfterDiscount: number;
  highSeasonDailyPriceAfterDiscount: number;
  peakSeasonDailyPriceAfterDiscount: number;
  priceMonthlyAfterDiscount: number;
  priceYearlyAfterDiscount: number;
  availabilityQuotaPerMonth: number;
  availabilityQuotaPerYear: number;
  highlight: string;
  address: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  mapLink: string;
  placeNearby: PlaceNearby[];
  checkInHour: string;
  checkOutHour: string;
  photos: string[];
  videos: string[];
  video360s: string[];
  floorPlans: string[];
  averageRating: number;
  ownerId: string;
  owner: Owner;
  currencyId: string;
  currency: Currency;
  createdAt: string;
  updatedAt: string;
  additionals: AdditionalItem[];
  facilities: Facilities[];
  features: Features[];
  policies: Policy[];
  reviews: Review[];
}
