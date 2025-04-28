import { Link } from "react-router-dom";
import { Button } from "../../components";
import { Layout, StatusBadge } from "../../components/ui";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaCalendar, FaRegStar, FaStar } from "react-icons/fa";
import { HiDownload } from "react-icons/hi";
import { useGetApi, useSearchPagination } from "../../hooks";
import { Booking, Data, PaginationProps, Payload, Review } from "../../types";
import { convertDate } from "../../utils";

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

const properties = [
  {
    title: "New Booking",
    icon: "/icons/mail-list.svg",
    link: "/",
    value: 69,
  },
  {
    title: "Property Booked",
    icon: "/icons/user-check.svg",
    link: "/",
    value: 30,
  },
  {
    title: "Property Interest",
    icon: "/icons/user-key.svg",
    link: "/",
    value: 10,
  },
];

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
  const { searchQuery: searchQueryReview, currentPage: currentPageReview, handlePageChange: handlePageChangeReview } = useSearchPagination();
  const { searchQuery: searchQueryBooking, currentPage: currentPageBooking, handlePageChange: handlePageChangeBooking } = useSearchPagination();

  const { data: respBooking, isError: isErrorBooking } = useGetApi<Payload<Data<Booking[]>>>({
    key: ["get-bookings", searchQueryBooking, currentPageBooking],
    url: "bookings",
    params: { search: searchQueryBooking, page: currentPageBooking, limit: "5" },
  });

  const bookings = respBooking?.data.data || [];
  const totalPageBooking = respBooking?.data.meta.totalPages || 1;

  const { data: respReviews, isError: isErrorReview } = useGetApi<Payload<Data<Review[]>>>({
    key: ["get-reviews", searchQueryReview, currentPageReview],
    url: "reviews",
    params: { search: searchQueryReview, page: currentPageReview, limit: "5" },
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
        {properties.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 rounded-lg shadow bg-light">
            <div className="space-y-4 text-dark">
              <h5 className="text-xl">{item.title}</h5>
              <span className="block text-4xl font-bold">{item.value}</span>
              <Link to={item.link} className="flex items-center gap-1 text-xs w-max">
                See All <IoIosArrowForward />
              </Link>
            </div>
            <div className="flex items-center justify-center rounded-full bg-tertiary size-20">
              <img src={item.icon} alt={item.title} className="size-12" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Booking Statistics */}
        <div className="p-4 rounded-lg shadow bg-light md:col-span-2 md:row-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Booking Statistics</h2>
            <span className="flex items-center gap-1 px-3 py-1 border rounded-lg">
              <FaCalendar /> Monthly
            </span>
          </div>
          <ResponsiveContainer width="100%" height={600}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Bar dataKey="value" fill="#2e5153" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Bookings */}
        <div className="p-4 rounded-lg shadow bg-light">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Bookings</h2>
            <Pagination page={currentPageBooking} setPage={handlePageChangeBooking} totalPage={totalPageBooking} />
          </div>
          {isErrorBooking && <p className="flex items-center justify-center text-center text-red-500 min-h-200">Error loading data. Please try again.</p>}
          {!isErrorBooking && bookings.length <= 1 && <p className="flex items-center justify-center text-center text-dark/50 min-h-200">No one has booked yet</p>}
          {bookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between py-2 text-sm">
              <div>
                <p className="font-bold">{booking.customer.name}</p>
                <p className="text-dark">{convertDate(booking.checkInDate)}</p>
              </div>
              <StatusBadge status={booking.status} />
            </div>
          ))}
        </div>

        {/*  Customer Reviews */}
        <div className="p-6 shadow bg-light rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Customer Reviews</h2>
            <Pagination page={currentPageReview} setPage={handlePageChangeReview} totalPage={totalPageReviews} />
          </div>
          <ul>
            {isErrorReview && <p className="flex items-center justify-center text-center text-red-500 min-h-200">Error loading data. Please try again.</p>}
            {!isErrorReview && reviews.length <= 1 && <p className="flex items-center justify-center text-center text-dark/50 min-h-200">No customer review</p>}
            {reviews.map((review, index) => (
              <li key={index} className="flex items-center justify-between py-2 border-b last:border-none">
                <div>
                  <p className="font-medium">{review.booking.customer.name}</p>
                  <p className="text-sm text-dark">{review.villa.name}</p>
                </div>
                <div className="flex text-yellow-500">{[...Array(5)].map((_, i) => (i < +review.rating ? <FaStar key={i} /> : <FaRegStar key={i} />))}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Best Sellers Section */}
        <div className="col-span-2 p-6 shadow bg-light rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Best Sellers</h2>
            <span className="flex items-center gap-1 px-3 py-1 border rounded-lg">
              <FaCalendar /> Yearly
            </span>
          </div>
          <ul>
            {Array(4)
              .fill("Uma Santai Villa, Bali, Indonesia")
              .map((_, index) => (
                <li key={index} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Uma Santai Villa</p>
                    <p className="text-sm text-dark">Bali, Indonesia</p>
                  </div>
                  <Button className="btn-primary">5 Bookings →</Button>
                </li>
              ))}
          </ul>
        </div>

        {/* Financial Reports Section */}
        <div className="p-6 shadow bg-light rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Financial Reports</h2>
            <span className="flex items-center gap-1 px-3 py-1 border rounded-lg">
              <FaCalendar /> Monthly
            </span>
          </div>
          <ul className="mb-2">
            {["April", "March", "February", "January"].map((month, index) => (
              <li key={index} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">{month}</p>
                  <p className="text-sm text-dark">2025</p>
                </div>
                <Button className="flex items-center gap-1 btn-primary">
                  Download <HiDownload />
                </Button>
              </li>
            ))}
          </ul>
          <Button className="w-full btn-primary">Download All</Button>
        </div>
      </div>
    </Layout>
  );
};
