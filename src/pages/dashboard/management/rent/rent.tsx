import * as React from "react";

import { useNavigate } from "react-router-dom";

import { useGetApi } from "../../../../hooks";

import { Layout } from "../../../../components/ui";
import { Pagination } from "../../../../components";

import { FaCheckSquare, FaEdit, FaWindowClose } from "react-icons/fa";
import { FaCalendar } from "react-icons/fa";

import { Booking, Data, Payload } from "../../../../types";

const statusColors: Record<string, string> = {
  requested: "bg-blue-300 text-blue-700",
  negotiation: "bg-orange-300 text-orange-700",
  "waiting for payment": "bg-yellow-300 text-yellow-700",
  booked: "bg-purple-300 text-purple-700",
  done: "bg-green-300 text-green-700",
  canceled: "bg-red-300 text-red-700",
};

export const RentPage = () => {
  const navigate = useNavigate();

  const [page, setPage] = React.useState<number>(1);

  const { data: bookings, isPending } = useGetApi<Payload<Data<Booking[]>>>({ key: ["get-bookings"], url: "bookings" });

  const totalPage = bookings?.data.meta.totalPages || 1;

  return (
    <Layout>
      {/* Header */}
      <header className="flex items-center justify-between pb-4 mb-6 border-b border-dark/30">
        <h1 className="text-2xl font-bold">Villa & Home Management</h1>

        <span className="flex items-center gap-2 px-4 py-2 rounded bg-light">
          <FaCalendar /> Today
        </span>
      </header>

      <div className="pb-8 border rounded-b bg-light border-dark/30">
        <div className="mb-8 overflow-x-auto scrollbar">
          {isPending ? (
            <div className="flex items-center justify-center min-h-200">
              <div className="loader size-12 after:size-12"></div>
            </div>
          ) : (
            <>
              <table className="min-w-full bg-light whitespace-nowrap">
                <thead>
                  <tr className="bg-primary text-light">
                    <th className="px-4 py-3 text-left">Villa</th>
                    {/* <th className="px-4 py-3 text-left">Rent</th> */}
                    <th className="px-4 py-3 text-left">Full Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Phone</th>
                    <th className="px-4 py-3 text-left">Guest</th>
                    <th className="px-4 py-3 text-left">Total Amount</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings?.data.data.map((booking) => (
                    <tr key={booking.id} className="h-full border-b">
                      <td className="px-4 py-3">{booking.villa.name}</td>
                      {/* <td className="px-4 py-3">{booking.rent}</td> */}
                      <td className="px-4 py-3">{booking.customer.name}</td>
                      <td className="px-4 py-3">{booking.customer.email}</td>
                      <td className="px-4 py-3">{booking.customer.phoneNumber}</td>
                      <td className="px-4 py-3 text-center">{booking.totalGuest}</td>
                      <td className="px-4 py-3 text-center">{booking.totalAmount}</td>
                      <td className="px-4 py-3">
                        <span className={`px-4 py-2 rounded-full text-sm ${statusColors[booking.status]}`}>{booking.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <FaEdit size={20} className="cursor-pointer text-primary" onClick={() => navigate(`/dashboard/management/rent/edit/${booking.id}`)} />
                          <FaCheckSquare size={20} className="text-green-600 cursor-pointer" />
                          <FaWindowClose size={20} className="text-red-600 cursor-pointer" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {bookings && bookings.data.data.length! < 1 && (
                <div className="flex items-center justify-center min-h-200 w-full">
                  <span className="text-3xl font-bold text-dark/50">Bookings not found</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Pagination */}
        <Pagination page={page} setPage={setPage} totalPage={totalPage} isNumbering />
      </div>
    </Layout>
  );
};
