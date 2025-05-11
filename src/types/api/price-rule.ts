import { Villa } from "./villa";

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
  villas: Villa[];
}
