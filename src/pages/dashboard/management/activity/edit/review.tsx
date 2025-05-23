import { useParams } from "react-router-dom";

import { useDeleteApi, useGetApi, useSearchPagination } from "../../../../../hooks";

import { DataTable, SearchBox } from "../../../../../components/ui";

import { Pagination } from "../../../../../components";

import { FaTrash } from "react-icons/fa";

import { Data, Payload, Review } from "../../../../../types";
import { convertDate } from "../../../../../utils";

interface ReviewsTableProps {
  reviews: Review[];
  onCancel: (id: string) => void;
  isLoading?: boolean;
  error?: unknown;
}

const Table = ({ reviews, onCancel, isLoading, error }: ReviewsTableProps) => {
  const columns = [
    {
      key: "activityBooking.customer.name" as keyof Review,
      header: "Name",
      render: (review: Review) => review.activityBooking.customer.name,
    },
    {
      key: "villa.country" as keyof Review,
      header: "Country",
      render: (review: Review) => review.activity.country,
    },
    {
      key: "activityBooking.bookingDate" as keyof Review,
      header: "Booking Date",
      render: (review: Review) => convertDate(review.activityBooking.bookingDate!),
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
    {
      key: "actions",
      header: "Actions",
      render: (review: Review) => (
        <div className="flex items-center justify-center gap-2">{onCancel && <FaTrash size={16} className="text-red-600 cursor-pointer" onClick={() => onCancel(review.id)} />}</div>
      ),
    },
  ];

  return <DataTable data={reviews} columns={columns} keyExtractor={(review) => review.id} isLoading={isLoading} error={error} emptyMessage="reviews not found" />;
};

export const ReviewTab: React.FC = () => {
  const { id } = useParams();

  const { searchQuery, inputValue, setInputValue, handleSearch, currentPage, handlePageChange } = useSearchPagination();

  const {
    data: respReviews,
    isPending,
    error,
  } = useGetApi<Payload<Data<Review[]>>>({
    key: ["get-reviews", id, searchQuery, currentPage],
    url: "reviews",
    params: { "filter.activityId": id, search: searchQuery, page: currentPage },
    enabled: Boolean(id),
  });

  const { mutate: deleteReview } = useDeleteApi({ key: ["delete-review"], url: "/reviews", redirectPath: `/dashboard/management/activity/edit/${id}` });

  const reviews = respReviews?.data.data || [];
  const totalPages = respReviews?.data.meta.totalPages || 1;

  const handleCancel = (reviewId: string) => {
    if (!window.confirm("Are you sure to delete this review?")) return;
    deleteReview(reviewId);
  };

  return (
    <>
      <h2 className="mb-8 heading">Reviews</h2>
      <SearchBox value={inputValue} onChange={setInputValue} onSearch={handleSearch} />
      <div className="pb-2 my-4 overflow-x-auto scrollbar min-h-600">
        <Table reviews={reviews} onCancel={handleCancel} isLoading={isPending} error={error} />
      </div>
      <Pagination page={currentPage} setPage={handlePageChange} totalPage={totalPages} isNumbering />
    </>
  );
};
