import { Link } from "react-router-dom";
import { Button } from "../../components";
import { Layout } from "../../components/ui";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaCalendar, FaRegStar, FaStar } from "react-icons/fa6";
import { HiDownload } from "react-icons/hi";

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

const reviews = [
  { name: "Adam Fadilah", villa: "Uma Santai Villa", rating: 5 },
  { name: "Adam Fadilah", villa: "Uma Santai Villa", rating: 5 },
  { name: "Adam Fadilah", villa: "Uma Santai Villa", rating: 5 },
  { name: "Adam Fadilah", villa: "Uma Santai Villa", rating: 5 },
  { name: "Adam Fadilah", villa: "Uma Santai Villa", rating: 4 },
];

export const MainPage = () => {
  return (
    <Layout>
      <header className="flex items-center justify-between pb-4 mb-6 border-b border-dark/20">
        <h1 className="text-2xl font-bold">Main Dashboard</h1>
        <span className="flex items-center gap-2 px-4 py-2 border rounded-md bg-light border-dark/20">
          <FaCalendar /> January 19, 2025
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
            <div className="flex space-x-2">
              <button>
                <IoIosArrowBack />
              </button>
              <button>
                <IoIosArrowForward />
              </button>
            </div>
          </div>
          {["Pending", "Payment", "Completed", "Pending"].map((status, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 text-sm">
              <div>
                <p className="font-bold">Adam Fadilah</p>
                <p className="text-dark">19 January 2025</p>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs font-bold ${
                  status === "Pending" ? "bg-red-100 text-red-500" : status === "Payment" ? "bg-yellow-100 text-yellow-500" : "bg-green-100 text-green-500"
                }
              `}
              >
                {status}
              </span>
            </div>
          ))}
        </div>

        {/*  Customer Reviews */}
        <div className="p-6 shadow bg-light rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Customer Reviews</h2>
            <div className="flex space-x-2">
              <button>
                <IoIosArrowBack />
              </button>
              <button>
                <IoIosArrowForward />
              </button>
            </div>
          </div>
          <ul>
            {reviews.map((review, index) => (
              <li key={index} className="flex items-center justify-between py-2 border-b last:border-none">
                <div>
                  <p className="font-medium">{review.name}</p>
                  <p className="text-sm text-dark">{review.villa}</p>
                </div>
                <div className="flex text-yellow-500">{[...Array(5)].map((_, i) => (i < review.rating ? <FaStar key={i} /> : <FaRegStar key={i} />))}</div>
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
