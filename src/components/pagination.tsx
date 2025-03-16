import { useMemo } from "react";

import { PaginationProps } from "../types";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export const Pagination = ({ setPage, page, totalPage, isNumbering }: PaginationProps) => {
  const maxVisiblePages = 3;

  // Utility for dynamic class handling
  const getButtonClass = (isDisabled: boolean) => `pagination-button group ${isDisabled ? "text-dark/50" : "hover:text-light hover:bg-primary"}`;

  const getIconClass = (isDisabled: boolean) => `duration-300 ${isDisabled ? "fill-dark/50" : "fill-primary group-hover:fill-light"}`;

  const handleNextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, totalPage));
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    const half = Math.floor(maxVisiblePages / 2);

    pages.push(1);

    if (page > half + 2) pages.push("...");

    const start = Math.max(2, page - half);
    const end = Math.min(totalPage - 1, page + half);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (page + half < totalPage - 1) pages.push("...");

    if (totalPage > 1) pages.push(totalPage);

    return pages;
  }, [page, totalPage, maxVisiblePages]);

  return (
    <div className="flex items-center justify-between gap-1 sm:gap-4">
      <button className={getButtonClass(page === 1)} type="button" onClick={handlePreviousPage} disabled={page === 1}>
        <IoIosArrowBack size={20} className={getIconClass(page === 1)} />
        Previous
      </button>

      <div className="flex items-center justify-center gap-1 sm:gap-4">
        {isNumbering &&
          pageNumbers.map((numberPage, index) =>
            typeof numberPage === "number" ? (
              <button key={index} type="button" onClick={() => setPage(numberPage)} className={`pagination-number ${numberPage === page ? "bg-primary text-light" : "bg-light text-dark"}`}>
                {numberPage}
              </button>
            ) : (
              <span key={index} className="p-0 text-3xl sm:p-1">
                {numberPage}
              </span>
            )
          )}
      </div>

      <button className={getButtonClass(page === totalPage || totalPage === 0)} type="button" onClick={handleNextPage} disabled={page === totalPage || totalPage === 0}>
        Next
        <IoIosArrowForward size={20} className={getIconClass(page === totalPage || totalPage === 0)} />
      </button>
    </div>
  );
};
