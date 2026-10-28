import { useParams } from "react-router-dom";

import { useGetApi, useSearchPagination, useUpdateApi } from "../../../../../hooks";

import { Pagination } from "../../../../../components";

import { FaCheckSquare, FaWindowClose } from "react-icons/fa";

import { nextApprovedStatus } from "../../../../../static";

import { Booking, Data, Payload } from "../../../../../types";
import { DataTable, SearchBox, StatusBadge } from "../../../../../components/ui";

interface BookingsTableProps {
  bookings: Booking[];
  onApprove?: (booking: Booking) => void;
  onCancel?: (id: string) => void;
  isLoading?: boolean;
  error?: unknown;
}

const Table = ({ bookings, onApprove, onCancel, isLoading, error }: BookingsTableProps) => {
  const columns = [
    {
      key: "activity.name" as keyof Booking,
      header: "Activity",
      render: (booking: Booking) => booking.activity?.name,
    },
    {
      key: "customer.name" as keyof Booking,
      header: "Full Name",
      render: (booking: Booking) => booking.customer?.name,
    },
    {
      key: "customer.email" as keyof Booking,
      header: "Email",
      render: (booking: Booking) => booking.customer?.email,
    },
    {
      key: "customer.phoneNumber" as keyof Booking,
      header: "Phone",
      render: (booking: Booking) => booking.customer?.phoneNumber,
    },
    {
      key: "activity.category.name" as keyof Booking,
      header: "Category",
      render: (booking: Booking) => booking.activity?.category?.name,
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
          {onApprove && <FaCheckSquare size={20} className="text-green-600 cursor-pointer" onClick={() => onApprove(booking)} />}
          {onCancel && <FaWindowClose size={20} className="text-red-600 cursor-pointer" onClick={() => onCancel(booking.id)} />}
        </div>
      ),
    },
  ];

  return <DataTable data={bookings} columns={columns} keyExtractor={(booking) => booking.id} isLoading={isLoading} error={error} emptyMessage="No one has booked yet" />;
};

export const OrderManagementTab: React.FC = () => {
  const { id } = useParams();

  const { searchQuery, inputValue, setInputValue, handleSearch, currentPage, handlePageChange } = useSearchPagination();

  const {
    data: respBookings,
    isPending,
    error,
    refetch,
  } = useGetApi<Payload<Data<Booking[]>>>({
    key: ["get-bookings", id, searchQuery, currentPage],
    url: "bookings",
    params: { "filter.activityId": id, search: searchQuery, page: currentPage, "filter.type": "$eq:activity" },
    enabled: Boolean(id),
  });

  const { mutate: editRent } = useUpdateApi<Partial<Booking>>({ key: ["edit-booking"], url: "bookings" });

  const bookings = respBookings?.data.data || [];
  const totalPages = respBookings?.data.meta.totalPages || 1;

  const handleApprove = (booking: Booking) => {
    // Activity bookings never had a `done` status — their vocabulary is
    // pending/confirmed/completed/canceled — so the old flat "done" always came
    // back 400. The next status depends on where the booking currently is.
    const nextStatus = nextApprovedStatus(booking.type, booking.status);

    if (!nextStatus) {
      window.alert(`Nothing to approve: this booking is already ${booking.status}.`);
      return;
    }

    if (!window.confirm("Are you sure you want to approve?")) return;

    editRent({ id: booking.id, updatedItem: { status: nextStatus } });
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
    <>
      <h2 className="mb-8 heading">Order Management</h2>
      <SearchBox value={inputValue} onChange={setInputValue} onSearch={handleSearch} />
      <div className="pb-2 my-4 overflow-x-auto scrollbar min-h-600">
        <Table bookings={bookings} onApprove={handleApprove} onCancel={handleCancel} isLoading={isPending} error={error} />
      </div>
      <Pagination page={currentPage} setPage={handlePageChange} totalPage={totalPages} isNumbering />
    </>
  );
};
