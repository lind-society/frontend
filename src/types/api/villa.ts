import { AdditionalItem, Facilities, Features, Icon, PlaceNearby } from "./global";

import { Currency } from "./currency";
import { Owner } from "./owner";
import { Review } from "./review";

export interface PolicyType {
  id: string;
  name: string;
}

/**
 * Read and write shapes differ, and conflating them was a real bug: the API
 * returns the type as a nested `type: { id, name }` object, while create/update
 * expect a flat `typeId`. The old declaration had only `typeId`, so every
 * `policy.typeId` read was `undefined` at runtime with TypeScript none the
 * wiser — which is why the villa edit form showed no policies at all.
 */
interface Policy {
  pivotId?: string;
  id?: string;
  name: string;
  /** Present on responses. */
  type?: PolicyType;
  /** Sent on create/update. */
  typeId?: string;
  description: string;
  icon: Icon;
  createdAt?: string;
  updatedAt?: string;
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
  /**
   * Sent on create/update, but absent from every response — the API returns the
   * relation only as the nested `owner`/`currency` object below. Declaring them
   * required made `data.ownerId` look safe while being `undefined` at runtime.
   */
  ownerId?: string;
  owner: Owner;
  currencyId?: string;
  currency: Currency;
  createdAt: string;
  updatedAt: string;
  additionals: AdditionalItem[];
  facilities: Facilities[];
  features: Features[];
  policies: Policy[];
  reviews: Review[];
}
