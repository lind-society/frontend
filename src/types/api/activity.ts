import { Currency } from "./currency";
import { PlaceNearby } from "./global";
import { Owner } from "./owner";

interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  name: string;
  secondaryName: string;
  highlight: string;
  price: number;
  discount: number;
  duration: string;
  address: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  mapLink: string;
  placeNearby: PlaceNearby[];
  openingHour: string;
  closingHour: string;
  startDate: string;
  endDate: string;
  photos: string[];
  videos: string[];
  video360s: string[];
  categoryId: string;
  currencyId: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner: Owner;
  currency: Currency;
  category: Category;
}
