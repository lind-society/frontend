import * as React from "react";
import { useSearchParams } from "react-router-dom";

interface SearchPaginationOptions {
  defaultPage?: number;
  searchParamName?: string;
  pageParamName?: string;
}

interface SearchPaginationResult {
  searchQuery: string;
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSearch: () => void;
  currentPage: number;
  handlePageChange: (newPage: number) => void;
}

export const useSearchPagination = (options?: SearchPaginationOptions): SearchPaginationResult => {
  const { defaultPage = 1, searchParamName = "search", pageParamName = "page" } = options || {};

  const [searchParams, setSearchParams] = useSearchParams();

  // Store search query in state to prevent null
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  // Extract values from URL or use defaults
  const currentPage = Number(searchParams.get(pageParamName)) || defaultPage;

  // Local state for input value
  const [inputValue, setInputValue] = React.useState<string>("");

  // Initialize the search query from URL
  React.useEffect(() => {
    const queryFromUrl = searchParams.get(searchParamName) || "";
    setSearchQuery(queryFromUrl);
    setInputValue(queryFromUrl);
  }, [searchParams, searchParamName]);

  // Search handler
  const handleSearch = React.useCallback(() => {
    // Update URL with search term
    const newParams = new URLSearchParams(searchParams);

    newParams.set(searchParamName, inputValue);

    // Reset to first page when searching
    newParams.set(pageParamName, String(defaultPage));

    setSearchParams(newParams);
    setSearchQuery(inputValue);
  }, [inputValue, defaultPage, searchParamName, pageParamName, searchParams, setSearchParams]);

  // Page change handler
  const handlePageChange = React.useCallback(
    (newPage: number) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set(pageParamName, String(newPage));
      setSearchParams(newParams);
    },
    [pageParamName, searchParams, setSearchParams]
  );

  return {
    searchQuery,
    inputValue,
    setInputValue,
    handleSearch,
    currentPage,
    handlePageChange,
  };
};
