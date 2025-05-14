export interface VillaPriceRule {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
}

export interface PriceRule {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  season: string;
  isDiscount: boolean;
  discount: number;
  isActive: boolean;
  villaIds: string[];
  villas: VillaPriceRule[];
}
