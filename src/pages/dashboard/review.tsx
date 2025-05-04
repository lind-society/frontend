import { useGetApi, useSearchPagination } from "../../hooks";

import { DataTable, Layout, SearchBox } from "../../components/ui";
import { Pagination } from "../../components";

import { FaCalendar } from "react-icons/fa";

import { Review, Data, Payload } from "../../types";

interface ReviewsTableProps {
  reviews: Review[];
  isLoading?: boolean;
  error?: unknown;
}

const Table = ({ reviews, isLoading, error }: ReviewsTableProps) => {
  const columns = [
    {
      key: "villa.name" as keyof Review,
      header: "Villa / Activity",
      render: (review: Review) => review.villa?.name || review.activity?.name,
    },
    {
      key: "villaBooking.customer.name" as keyof Review,
      header: "Full Name",
      render: (review: Review) => review.villaBooking?.customer?.name || review.activityBooking?.customer?.name,
    },
    {
      key: "villaBooking.customer.email" as keyof Review,
      header: "Email",
      render: (review: Review) => review.villaBooking?.customer?.email || review.activityBooking?.customer?.email,
    },
    {
      key: "rating" as keyof Review,
      header: "Rating",
      className: "px-4 py-3 text-center",
    },
    {
      key: "message" as keyof Review,
      header: "Message",
      className: "max-w-96 w-full py-3 px-4 overflow-hidden",
    },
  ];

  return <DataTable data={reviews} columns={columns} keyExtractor={(review) => review.id} isLoading={isLoading} error={error} emptyMessage="No one has review yet" />;
};

export const ReviewPage = () => {
  const { searchQuery, inputValue, setInputValue, handleSearch, currentPage, handlePageChange } = useSearchPagination();

  const {
    data: respReviews,
    isPending,
    error,
  } = useGetApi<Payload<Data<Review[]>>>({ key: ["get-reviews-villas", searchQuery, currentPage], url: "reviews", params: { search: searchQuery, page: currentPage } });

  const reviews = respReviews?.data.data || [];
  const totalPages = respReviews?.data.meta.totalPages || 1;

  const formatted = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "medium",
  }).format(new Date());

  return (
    <Layout>
      {/* Header */}
      <header className="flex items-center justify-between pb-4 mb-6 border-b border-dark/30">
        <h1 className="head-title">Reviews</h1>

        <span className="flex items-center gap-2 px-4 py-2 rounded bg-light">
          <FaCalendar /> {formatted}
        </span>
      </header>

      <SearchBox value={inputValue} onChange={setInputValue} onSearch={handleSearch} />

      <div className="pb-8 mt-2 border rounded-b bg-light border-dark/30">
        <div className="pb-2 mb-4 overflow-x-auto scrollbar min-h-600">
          <Table reviews={reviews} isLoading={isPending} error={error} />
        </div>
        <Pagination page={currentPage} setPage={handlePageChange} totalPage={totalPages} isNumbering />
      </div>
    </Layout>
  );
};
