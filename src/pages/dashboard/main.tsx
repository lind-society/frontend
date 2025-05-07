import * as React from "react";
import { Link } from "react-router-dom";

import { useGetApi } from "../../hooks";

import { Button } from "../../components";
import { Layout, StatusBadge } from "../../components/ui";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaCalendar, FaRegStar, FaStar } from "react-icons/fa";

import { convertDate, getTodayTime } from "../../utils";

import { Booking, Data, PaginationProps, Payload, Review, VillaBestSeller } from "../../types";

const data = [
  { name: "Jan", value: 100 },
  { name: "Feb", value: 50 },
  { name: "Mar", value: 40 },
  { name: "Apr", value: 20 },
  { name: "May", value: 60 },
  { name: "Jun", value: 70 },
  { name: "Jul", value: 110 },
  { name: "Aug", value: 80 },
  { name: "Sep", value: 60 },
];

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-yellow-300 text-yellow-700",
  Confirmed: "bg-purple-300 text-purple-700",
  Completed: "bg-green-300 text-green-700",
  Canceled: "bg-red-300 text-red-700",
};

const Pagination = ({ setPage, page, totalPage }: PaginationProps) => {
  const updatePage = (newPage: number) => {
    setPage(newPage);
  };
  const handleNextPage = () => {
    updatePage(Math.min(page + 1, totalPage));
  };
  const handlePreviousPage = () => {
    updatePage(Math.max(page - 1, 1));
  };
  return (
    <div className="flex items-center justify-between gap-1 sm:gap-4">
      <button type="button" onClick={handlePreviousPage} disabled={page === 1}>
        <IoIosArrowBack size={20} className={page === 1 ? "text-primary/50" : "text-primary"} />
      </button>

      <button type="button" onClick={handleNextPage} disabled={page === totalPage || totalPage === 0}>
        <IoIosArrowForward size={20} className={page === totalPage || totalPage === 0 ? "text-primary/50" : "text-primary"} />
      </button>
    </div>
  );
};

export const MainPage = () => {
  const [currentPageBookingVilla, setCurrentPageBookingVilla] = React.useState<number>(1);
  const [currentPageBookingActivity, setCurrentPageBookingActivity] = React.useState<number>(1);
  const [currentPageReview, setCurrentPageReview] = React.useState<number>(1);

  const today = getTodayTime();

  const { data: respVillasBestSeller, isError: isErrorVillasBestSeller } = useGetApi<Payload<Data<VillaBestSeller[]>>>({
    key: ["get-villas-best-seller"],
    url: "villas/best-seller",
  });

  const { data: respBookingVilla, isError: isErrorBookingVilla } = useGetApi<Payload<Data<Booking[]>>>({
    key: ["get-bookings", currentPageBookingVilla],
    url: `bookings/villas?filter.createdAt=$gte:${today}T:00:00.000Z&filter.createdAt=$lte:${today}T23:59:59.999Z`,
    params: { page: currentPageBookingVilla, limit: "5" },
  });

  const bookingsVilla = respBookingVilla?.data.data || [];
  const totalPageBookingVilla = respBookingVilla?.data.meta.totalPages || 1;

  const { data: respBookingActivity, isError: isErrorBookingActivity } = useGetApi<Payload<Data<Booking[]>>>({
    key: ["get-activities", currentPageBookingActivity],
    url: `bookings/activities?filter.createdAt=$gte:${today}T:00:00.000Z&filter.createdAt=$lte:${today}T23:59:59.999Z`,
    params: { page: currentPageBookingActivity, limit: "5" },
  });

  const bookingsActivity = respBookingActivity?.data.data || [];
  const totalPageBookingActivity = respBookingActivity?.data.meta.totalPages || 1;

  const { data: respReviews, isError: isErrorReview } = useGetApi<Payload<Data<Review[]>>>({
    key: ["get-reviews", currentPageReview],
    url: `reviews?filter.createdAt=$gte:${today}T:00:00.000Z&filter.createdAt=$lte:${today}T23:59:59.999Z`,
    params: { page: currentPageReview, limit: "5" },
  });

  const reviews = respReviews?.data.data || [];
  const totalPageReviews = respReviews?.data.meta.totalPages || 1;

  const formatted = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "medium",
  }).format(new Date());

  return (
    <Layout>
      <header className="flex items-center justify-between pb-4 mb-6 border-b border-dark/30">
        <h1 className="head-title">Main Dashboard</h1>
        <span className="flex items-center gap-2 px-4 py-2 border rounded bg-light border-dark/30">
          <FaCalendar /> {formatted}
        </span>
      </header>

      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
        <div className="flex items-center justify-between p-4 rounded-lg shadow bg-light">
          <div className="space-y-4 text-dark">
            <h5 className="text-xl">Rent Villa Today</h5>
            <span className="block text-4xl font-bold">{respBookingVilla?.data.meta.totalItems || 0}</span>
            <Link to="/dashboard/management/rent" className="flex items-center gap-1 text-xs w-max">
              See All <IoIosArrowForward />
            </Link>
          </div>
          <div className="flex items-center justify-center rounded-full bg-tertiary size-20">
            <img src="/icons/online-booking.png" alt="online-booking" className="size-12" />
          </div>
        </div>
        <div className="flex items-center justify-between p-4 rounded-lg shadow bg-light">
          <div className="space-y-4 text-dark">
            <h5 className="text-xl">Order Activity Today</h5>
            <span className="block text-4xl font-bold">{respBookingActivity?.data.meta.totalItems || 0}</span>
            <Link to="/dashboard/management/order" className="flex items-center gap-1 text-xs w-max">
              See All <IoIosArrowForward />
            </Link>
          </div>
          <div className="flex items-center justify-center rounded-full bg-tertiary size-20">
            <img src="/icons/checklist.png" alt="checklist" className="size-12" />
          </div>
        </div>
        <div className="flex items-center justify-between p-4 rounded-lg shadow bg-light">
          <div className="space-y-4 text-dark">
            <h5 className="text-xl">Total Review today</h5>
            <span className="block text-4xl font-bold">{respReviews?.data.meta.totalItems || 0}</span>
            <Link to="/dashboard/review" className="flex items-center gap-1 text-xs w-max">
              See All <IoIosArrowForward />
            </Link>
          </div>
          <div className="flex items-center justify-center rounded-full bg-tertiary size-20">
            <img src="/icons/scale.png" alt="scale" className="size-12" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="p-6 rounded-lg shadow bg-light md:col-span-2 md:row-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Booking Statistics</h2>
          </div>
          <ResponsiveContainer width="100%" height={800}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Bar dataKey="value" fill="#2e5153" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 rounded-lg shadow bg-light min-h-400">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recent Rent Home & Villa</h2>
            <Pagination page={currentPageBookingVilla} setPage={setCurrentPageBookingVilla} totalPage={totalPageBookingVilla} />
          </div>
          {isErrorBookingVilla && <p className="flex items-center justify-center text-center text-red-500 min-h-200">Error loading data. Please try again.</p>}
          {!isErrorBookingVilla && bookingsVilla.length < 1 && <p className="flex items-center justify-center text-center text-dark/50 min-h-200">No one has booked yet</p>}
          <div className="space-y-2">
            {bookingsVilla.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between py-2 text-sm">
                <div className="space-y-1">
                  <p className="font-bold">{booking.customer.name}</p>
                  <p className="text-dark">{convertDate(booking.checkInDate)}</p>
                </div>
                <StatusBadge status={booking.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 shadow bg-light rounded-xl min-h-400">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recent Order Activity</h2>
            <Pagination page={currentPageBookingActivity} setPage={setCurrentPageBookingActivity} totalPage={totalPageBookingActivity} />
          </div>
          {isErrorBookingActivity && <p className="flex items-center justify-center text-center text-red-500 min-h-200">Error loading data. Please try again.</p>}
          {!isErrorBookingActivity && bookingsActivity.length < 1 && <p className="flex items-center justify-center text-center text-dark/50 min-h-200">No one has order yet</p>}
          <ul className="space-y-2">
            {bookingsActivity.map((booking) => (
              <li key={booking.id} className="flex items-center justify-between py-2 text-sm">
                <div className="space-y-1">
                  <p className="font-bold">{booking.customer.name}</p>
                  <p className="text-dark">{convertDate(booking.bookingDate)}</p>
                </div>
                <StatusBadge status={booking.status} colors={STATUS_COLORS} />
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2 p-6 shadow min-h-400 bg-light rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Best Sellers</h2>
          </div>
          {isErrorVillasBestSeller && <p className="flex items-center justify-center text-center text-red-500 min-h-200">Error loading data. Please try again.</p>}
          {!isErrorVillasBestSeller && respVillasBestSeller?.data.data.length! < 1 && <p className="flex items-center justify-center text-center text-dark/50 min-h-200">No one has booking yet</p>}
          <ul className="space-y-4">
            {respVillasBestSeller?.data.data.map((villa) => (
              <li key={villa.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">{villa.name}</p>
                  <p className="text-sm text-dark">Bali, Indonesia</p>
                </div>
                <Button className="btn-primary">{villa.bookingCount} Bookings →</Button>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 shadow bg-light rounded-xl min-h-400">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Customer Reviews</h2>
            <Pagination page={currentPageReview} setPage={setCurrentPageReview} totalPage={totalPageReviews} />
          </div>
          {isErrorReview && <p className="flex items-center justify-center text-center text-red-500 min-h-200">Error loading data. Please try again.</p>}
          {!isErrorReview && reviews.length < 1 && <p className="flex items-center justify-center text-center text-dark/50 min-h-200">No customer review</p>}
          <ul className="space-y-4">
            {reviews.map((review, index) => (
              <li key={index} className="flex items-center justify-between border-b last:border-none">
                <div>
                  <p className="font-medium">
                    {review?.villaBooking?.customer?.name || review?.activityBooking?.customer?.name} <strong>[{review.villaId ? "VILLA" : "ACTIVITY"}]</strong>
                  </p>
                  <p className="text-sm text-dark">{review?.villa?.name || review?.activity?.name}</p>
                </div>
                <div className="flex text-yellow-500">{[...Array(5)].map((_, i) => (i < review.rating ? <FaStar key={i} /> : <FaRegStar key={i} />))}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};
