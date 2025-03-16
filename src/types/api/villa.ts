import { Currency } from "./currency";
import { Review } from "./review";

interface AvailabilityPerPrice {
  quota: number;
  availability: string;
}

interface PlaceNearby {
  name: string;
  distance: number;
}

interface AdditionalItem {
  pivotId: string;
  id: string;
  name: string;
  type: string;
  description: string;
  photos: string[];
  createdAt: string;
  updatedAt: string;
}

interface Additional {
  [key: string]: AdditionalItem[];
}

interface Facility {
  pivotId: string;
  id: string;
  name: string;
  icon: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

interface Facilities {
  optional: Facility[];
}

interface Feature {
  pivotId: string;
  id: string;
  name: string;
  icon: string;
  free: boolean;
  currencyId: string | null;
  currency: Currency;
  price: string | null;
  list: string[];
  createdAt: string;
  updatedAt: string;
}

interface Policy {
  pivotId: string;
  id: string;
  name: string;
  type: string;
  description: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface Villa {
  id: string;
  name: string;
  secondaryName: string;
  availability: string[];
  priceDaily: string;
  priceMonthly: string;
  priceYearly: string | null;
  discountDaily: string;
  discountMonthly: string;
  discountYearly: string | null;
  priceDailyAfterDiscount: string;
  priceMonthlyAfterDiscount: string;
  priceYearlyAfterDiscount: string;
  availabilityPerPrice: AvailabilityPerPrice[];
  ownershipType: string;
  highlight: string;
  address: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  mapLink: string;
  placeNearby: PlaceNearby[];
  photos: string[];
  videos: string[];
  video360s: string[];
  soldStatus: boolean;
  ownerId: string | null;
  currencyId: string | null;
  currency: Currency;
  createdAt: string;
  updatedAt: string;
  additional: Additional;
  facilities: Facilities;
  features: Feature[];
  policies: Policy[];
  reviews: Review[];
}
