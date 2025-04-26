export interface Benefit {
  id: string;
  title: string;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  benefits: Benefit[];
}
