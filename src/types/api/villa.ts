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

interface Facilities {
  pivotId: string;
  id: string;
  name: string;
  icon: {
    key: string;
    url: string;
  };
  type: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface Features {
  pivotId: string;
  id: string;
  name: string;
  type: string;
  icon: {
    key: string;
    url: string;
  };
  free: boolean;
  currencyId: string;
  currencyCode: string;
  discountType: string;
  discount: number | null;
  priceAfterDiscount: number;
  price: number;
  createdAt: string;
  updatedAt: string;
  currency: Currency;
}

interface Policy {
  pivotId: string;
  id: string;
  name: string;
  type: string;
  description: string;
  icon: {
    key: string;
    url: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Villa {
  id: string;
  name: string;
  secondaryName: string;
  availability: string[];
  priceDaily: number;
  priceMonthly: number;
  priceYearly: number;
  discountDailyType: string;
  discountMonthlyType: string;
  discountYearlyType: string;
  discountDaily: number;
  discountMonthly: number;
  discountYearly: number;
  priceDailyAfterDiscount: number;
  priceMonthlyAfterDiscount: number;
  priceYearlyAfterDiscount: number;
  availabilityPerPrice: AvailabilityPerPrice[];
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
  ownerId: string | null;
  currencyId: string | null;
  currencyCode: string | null;
  currency: Currency;
  createdAt: string;
  updatedAt: string;
  additionals: AdditionalItem[];
  facilities: Facilities[];
  features: Features[];
  policies: Policy[];
  reviews: Review[];
}
