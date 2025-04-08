import { useNavigate, useParams } from "react-router-dom";

import { useGetApi, useSearchPagination } from "../../../../../hooks";

import { DataTable, Pagination, SearchBox, StatusBadge } from "../../../../../components";

import { FaCheckSquare, FaEdit, FaWindowClose } from "react-icons/fa";

import { Booking, Data, Payload } from "../../../../../types";

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
      render: (booking: Booking) => booking.villa.name,
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

export const RentManagement = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { searchQuery, inputValue, setInputValue, handleSearch, currentPage, handlePageChange } = useSearchPagination();

  const {
    data: respBookings,
    isPending,
    error,
  } = useGetApi<Payload<Data<Booking[]>>>({
    key: ["get-bookings", id, searchQuery, currentPage],
    url: "bookings",
    params: { "filter.villaId": id, search: searchQuery, page: currentPage },
    enabled: Boolean(id),
  });

  const bookings = respBookings?.data.data || [];
  const totalPages = respBookings?.data.meta.totalPages || 1;

  const handleEdit = (bookingId: string) => {
    navigate(`/dashboard/management/rent/edit/${bookingId}`);
  };

  const handleApprove = (bookingId: string) => {
    // Implement booking approval logic
    console.log(`Approve booking ${bookingId}`);
  };

  const handleCancel = (bookingId: string) => {
    // Implement booking cancellation logic
    console.log(`Cancel booking ${bookingId}`);
  };

  return (
    <div className="p-8 space-y-4 border rounded-b bg-light border-dark/30">
      <h2 className="heading">Rent Management</h2>
      <SearchBox value={inputValue} onChange={setInputValue} onSearch={handleSearch} />
      <div className="pb-2 overflow-x-auto scrollbar min-h-600">
        <Table bookings={bookings} onEdit={handleEdit} onApprove={handleApprove} onCancel={handleCancel} isLoading={isPending} error={error} />
      </div>
      <Pagination page={currentPage} setPage={handlePageChange} totalPage={totalPages} isNumbering />
    </div>
  );
};
