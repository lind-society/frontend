interface Benefits {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  benefits: Benefits[];
}
