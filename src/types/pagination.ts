export interface PaginationProps {
  page: number;
  setPage: (page: number) => void;
  totalPage: number;
  isNumbering?: boolean;
  withQuerySync?: boolean;
}
