export interface TableHeaderProps<T> {
  columns: {
    key: keyof T | string;
    header: React.ReactNode;
    className?: string;
  }[];
}

export interface DataTableProps<T> {
  data: T[];
  columns: {
    key: keyof T | string;
    header: React.ReactNode;
    render?: (item: T) => React.ReactNode;
    className?: string;
  }[];
  keyExtractor: (item: T) => string | number;
  isLoading?: boolean;
  error?: unknown;
  emptyMessage?: string;
}
