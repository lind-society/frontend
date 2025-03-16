export interface PaginationProps {
  setPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  totalPage: number;
  isNumbering?: boolean;
}
