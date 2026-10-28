export interface Benefit {
  id: string;
  title: string;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  /** e.g. 8 = "8% of rental revenue". Shown on the public pricing page. */
  commissionPercentage: number | null;
  benefits: Benefit[];
}
