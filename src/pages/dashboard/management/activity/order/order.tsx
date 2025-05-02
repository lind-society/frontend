import { useGetApi, useSearchPagination } from "../../../../../hooks";

import { DataTable, Layout, SearchBox, StatusBadge } from "../../../../../components/ui";
import { Img, Pagination } from "../../../../../components";

import { FaCalendar } from "react-icons/fa";

import { Booking, Data, Payload } from "../../../../../types";

interface BookingsTableProps {
  bookings: Booking[];
  isLoading?: boolean;
  error?: unknown;
}

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-yellow-300 text-yellow-700",
  Confirmed: "bg-purple-300 text-purple-700",
  Completed: "bg-green-300 text-green-700",
  Canceled: "bg-red-300 text-red-700",
};

const Table = ({ bookings, isLoading, error }: BookingsTableProps) => {
  const columns = [
    {
      key: "activity.name" as keyof Booking,
      header: "Image",
      render: (booking: Booking) => <Img src={booking.activity?.photos[0] || "/images/modern-villa-background.webp"} alt={booking.activity?.name} className="size-14" />,
    },
    {
      key: "activity.name" as keyof Booking,
      header: "Activity",
      render: (booking: Booking) => booking.activity?.name,
    },
    {
      key: "customer.name" as keyof Booking,
      header: "Full Name",
      render: (booking: Booking) => booking.customer.name,
    },
    {
      key: "customer.email" as keyof Booking,
      header: "Email",
      render: (booking: Booking) => booking.customer.email,
    },
    {
      key: "customer.phoneNumber" as keyof Booking,
      header: "Phone",
      render: (booking: Booking) => booking.customer.phoneNumber,
    },
    // {
    //   key: "activity.category.name" as keyof Booking,
    //   header: "Category",
    //   render: (booking: Booking) => booking.activity.category.name,
    // },
    {
      key: "status" as keyof Booking,
      header: "Status",
      render: (booking: Booking) => <StatusBadge status={booking.status} colors={STATUS_COLORS} />,
    },
  ];

  return <DataTable data={bookings} columns={columns} keyExtractor={(booking) => booking.id} isLoading={isLoading} error={error} emptyMessage="No one has order yet" />;
};

export const OrderPage = () => {
  const { searchQuery, inputValue, setInputValue, handleSearch, currentPage, handlePageChange } = useSearchPagination();

  const {
    data: respBookings,
    isPending,
    error,
  } = useGetApi<Payload<Data<Booking[]>>>({ key: ["get-bookings-activities", searchQuery, currentPage], url: "bookings/activities", params: { search: searchQuery, page: currentPage } });

  const bookings = respBookings?.data.data || [];
  const totalPages = respBookings?.data.meta.totalPages || 1;

  const formatted = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "medium",
  }).format(new Date());

  return (
    <Layout>
      {/* Header */}
      <header className="flex items-center justify-between pb-4 mb-6 border-b border-dark/30">
        <h1 className="head-title">Order Activity Management</h1>

        <span className="flex items-center gap-2 px-4 py-2 rounded bg-light">
          <FaCalendar /> {formatted}
        </span>
      </header>

      <SearchBox value={inputValue} onChange={setInputValue} onSearch={handleSearch} />

      <div className="pb-8 mt-2 border rounded-b bg-light border-dark/30">
        <div className="pb-2 mb-4 overflow-x-auto scrollbar min-h-600">
          <Table bookings={bookings} isLoading={isPending} error={error} />
        </div>
        <Pagination page={currentPage} setPage={handlePageChange} totalPage={totalPages} isNumbering />
      </div>
    </Layout>
  );
};
