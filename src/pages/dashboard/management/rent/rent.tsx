import { useNavigate } from "react-router-dom";

import { useGetApi, useSearchPagination, useUpdateApi } from "../../../../hooks";

import { DataTable, Layout, SearchBox, StatusBadge } from "../../../../components/ui";
import { Pagination } from "../../../../components";

import { FaCheckSquare, FaEdit, FaWindowClose } from "react-icons/fa";
import { FaCalendar } from "react-icons/fa";

import { Booking, Data, Payload } from "../../../../types";

interface BookingsTableProps {
  bookings: Booking[];
  onEdit: (id: string) => void;
  onApprove?: (id: string) => void;
  onCancel?: (id: string) => void;
  isLoading?: boolean;
  error?: unknown;
}

const Table = ({ bookings, onEdit, onApprove, onCancel, isLoading, error }: BookingsTableProps) => {
  const columns = [
    {
      key: "villa.name" as keyof Booking,
      header: "Villa",
      render: (booking: Booking) => booking.villa?.name,
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
    {
      key: "totalGuest" as keyof Booking,
      header: "Guest",
      className: "px-4 py-3 text-center",
    },
    {
      key: "totalAmount" as keyof Booking,
      header: "Total Amount",
      className: "px-4 py-3 text-center",
    },
    {
      key: "status" as keyof Booking,
      header: "Status",
      render: (booking: Booking) => <StatusBadge status={booking.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (booking: Booking) => (
        <div className="flex items-center justify-center gap-2">
          <FaEdit size={20} className="cursor-pointer text-primary" onClick={() => onEdit(booking.id)} />
          {onApprove && <FaCheckSquare size={20} className="text-green-600 cursor-pointer" onClick={() => onApprove(booking.id)} />}
          {onCancel && <FaWindowClose size={20} className="text-red-600 cursor-pointer" onClick={() => onCancel(booking.id)} />}
        </div>
      ),
    },
  ];

  return <DataTable data={bookings} columns={columns} keyExtractor={(booking) => booking.id} isLoading={isLoading} error={error} emptyMessage="Bookings not found" />;
};

export const RentPage = () => {
  const navigate = useNavigate();

  const { searchQuery, inputValue, setInputValue, handleSearch, currentPage, handlePageChange } = useSearchPagination();

  const {
    data: respBookings,
    isPending,
    error,
    refetch,
  } = useGetApi<Payload<Data<Booking[]>>>({ key: ["get-bookings", searchQuery, currentPage], url: "bookings", params: { search: searchQuery, page: currentPage } });

  const { mutate: editRent } = useUpdateApi({ key: ["edit-booking"], url: "/bookings" });

  const bookings = respBookings?.data.data || [];
  const totalPages = respBookings?.data.meta.totalPages || 1;

  const formatted = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "medium",
  }).format(new Date());

  const handleEdit = (bookingId: string) => {
    navigate(`/dashboard/management/rent/edit/${bookingId}`);
  };

  const handleApprove = (bookingId: string) => {
    if (!window.confirm("Are you sure you want to approve?")) return;
    editRent({ id: bookingId, updatedItem: { status: "done" } });
    setTimeout(() => {
      refetch();
    }, 1000);
  };

  const handleCancel = (bookingId: string) => {
    if (!window.confirm("Are you sure you want to cancel?")) return;
    editRent({ id: bookingId, updatedItem: { status: "canceled" } });
    setTimeout(() => {
      refetch();
    }, 1000);
  };

  return (
    <Layout>
      {/* Header */}
      <header className="flex items-center justify-between pb-4 mb-6 border-b border-dark/30">
        <h1 className="text-2xl font-bold">Villa & Home Management</h1>

        <span className="flex items-center gap-2 px-4 py-2 rounded bg-light">
          <FaCalendar /> {formatted}
        </span>
      </header>

      <SearchBox value={inputValue} onChange={setInputValue} onSearch={handleSearch} />

      <div className="pb-8 mt-2 border rounded-b bg-light border-dark/30">
        <div className="pb-2 mb-4 overflow-x-auto scrollbar min-h-600">
          <Table bookings={bookings} onEdit={handleEdit} onApprove={handleApprove} onCancel={handleCancel} isLoading={isPending} error={error} />
        </div>
        <Pagination page={currentPage} setPage={handlePageChange} totalPage={totalPages} isNumbering />
      </div>
    </Layout>
  );
};
