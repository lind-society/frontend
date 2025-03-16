export class PaginateResponseMetaProps {
  itemsPerPage!: number;
  totalItems!: number;
  currentPage!: number;
  totalPages!: number;
  sortBy!: unknown;
  searchBy!: unknown;
  search!: string;
  select!: string[];
  filter?: {
    [column: string]: string | string[];
  };
}

export class PaginateResponseLinksProps {
  first?: string | null;
  previous?: string | null;
  current!: string;
  next?: string | null;
  last?: string | null;
}

export interface Data<T> {
  links: PaginateResponseLinksProps;
  meta: PaginateResponseMetaProps;
  data: T;
}

export interface File {
  successFiles: {
    url: string;
  }[];
}

export interface Payload<T> {
  data: T;
  message: string;
  code: number;
  status: "success" | "fail" | "error";
}
