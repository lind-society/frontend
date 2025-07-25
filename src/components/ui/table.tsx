interface TableHeaderProps<T> {
  columns: {
    key: keyof T | string;
    header: React.ReactNode;
    className?: string;
  }[];
}

interface DataTableProps<T> {
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

const TableHeader = <T,>({ columns }: TableHeaderProps<T>) => {
  return (
    <thead>
      <tr className="bg-primary text-light">
        {columns.map((column, index) => (
          <th key={index} className={column.className || "px-4 py-3.5 text-left whitespace-nowrap"}>
            {column.header}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export const DataTable = <T,>({ data, columns, keyExtractor, isLoading = false, error = null, emptyMessage = "No data found" }: DataTableProps<T>) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="loader size-16 after:size-16"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16">
        <span className="text-red-500">Error loading data. Please try again.</span>
      </div>
    );
  }

  return (
    <>
      <table className="min-w-full bg-light">
        <TableHeader columns={columns} />
        <tbody>
          {data.map((item) => {
            return (
              <tr key={keyExtractor(item)} className="h-full border-b">
                {columns.map((column, columnIndex) => {
                  const cellContent = column.render ? column.render(item) : typeof column.key === "string" ? (item[column.key as keyof T] as React.ReactNode) : (item[column.key] as React.ReactNode);

                  return (
                    <td key={columnIndex} className={column.className || "px-4 py-3.5 whitespace-nowrap"}>
                      {cellContent}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="flex items-center justify-center w-full py-16">
          <p className="text-center text-dark/50">{emptyMessage}</p>
        </div>
      )}
    </>
  );
};
