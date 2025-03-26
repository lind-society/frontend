import { Currency } from "./currency";
import { AdditionalItem, Facilities, Features, PlaceNearby } from "./global";

export interface Property {
  id: string;
  name: string;
  secondaryName: string;
  price: number;
  discountType: number;
  discount: number;
  priceAfterDiscount: number;
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
  currencyId: string;
  currencyCode: string;
  currency: Currency;
  ownerId: string;
  ownerName: string;
  createdAt: string;
  updatedAt: string;
  additionals: AdditionalItem[];
  facilities: Facilities[];
  features: Features[];
}
