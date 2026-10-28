import { Currency } from "./currency";
import { Icon } from "./global";

/**
 * Master data entities — the standalone shapes returned by their own endpoints.
 *
 * Note: `Facilities`, `Features` and `AdditionalItem` in ./global are the *pivot*
 * shapes (they carry `pivotId`) as embedded inside a villa/property response.
 * The types below are the base records managed through their own CRUD endpoints.
 */

export type FacilityType = "main" | "optional";

export type AdditionalType = "bedrooms" | "indoor_areas" | "outdoor_areas" | "more_pictures";

export type DiscountType = "percentage" | "fixed";

// facilities
export interface Facility {
  id: string;
  name: string;
  icon: Icon | null;
  type: FacilityType;
  createdAt: string;
  updatedAt: string;
}

export interface FacilityPayload {
  name: string;
  icon?: Icon;
  type?: FacilityType;
}

// features
export interface Feature {
  id: string;
  type: string;
  name: string;
  icon: Icon | null;
  free: boolean;
  currencyId: string | null;
  price: number | null;
  discountType: DiscountType | null;
  discount: number | null;
  priceAfterDiscount: number | null;
  currency?: Currency;
  createdAt: string;
  updatedAt: string;
}

export interface FeaturePayload {
  type: string;
  name: string;
  icon?: Icon;
  free?: boolean;
  currencyId: string;
  price?: number;
  discountType?: DiscountType;
  discount?: number;
}

// additionals
export interface Additional {
  id: string;
  type: AdditionalType;
  name: string;
  description: string | null;
  photos: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdditionalPayload {
  name: string;
  type: AdditionalType;
  description?: string;
  photos?: string[];
}

// villa policy types
export interface VillaPolicyType {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface VillaPolicyTypePayload {
  name: string;
}

// villa policies
export interface VillaPolicy {
  id: string;
  name: string;
  typeId: string;
  description: string | null;
  icon: Icon | null;
  type?: VillaPolicyType;
  createdAt: string;
  updatedAt: string;
}

export interface VillaPolicyPayload {
  name: string;
  typeId: string;
  description?: string;
  icon?: Icon;
}
