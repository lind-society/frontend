export interface PlaceNearby {
  name: string;
  distance: number;
}

export interface Icon {
  key: string;
  url: string;
}

export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  allowDecimal: string;
  allowRound: string;
  createdAt: string;
  updatedAt: string;
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
