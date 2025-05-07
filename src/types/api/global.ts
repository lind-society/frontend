import { Currency } from "./currency";

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface PhoneCodes {
  name: string;
  dial_code: string;
  code: string;
}

export interface PlaceNearby {
  name: string;
  distance: number;
}

export interface Icon {
  key: string;
  url: string;
}

export interface VillaBestSeller {
  id: string;
  name: string;
  averageRating: string;
  bookingCount: string;
}

export interface AdditionalItem {
  pivotId: string;
  id: string;
  name: string;
  type: string;
  description: string;
  photos: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Facilities {
  pivotId: string;
  id: string;
  name: string;
  icon: Icon;
  type: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Features {
  pivotId: string;
  id: string;
  name: string;
  type: string;
  icon: Icon;
  free: boolean;
  currencyId: string;
  discountType: string;
  discount: number | null;
  priceAfterDiscount: number;
  price: number;
  createdAt: string;
  updatedAt: string;
  currency: Currency;
}
