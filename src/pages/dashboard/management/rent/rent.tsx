import { Layout } from "../../../../components/ui";

import { Button, Img } from "../../../../components";

import { useNavigate } from "react-router-dom";

import { FaCheckSquare, FaEdit, FaWindowClose } from "react-icons/fa";
import { FaCalendar } from "react-icons/fa";
import { IoMdLink, IoMdNotifications } from "react-icons/io";

const statuses = ["On Negotiation", "Payment", "Completed", "Cancelled"];

const data = new Array(6).fill({
  image: "/temp.png",
  property: "Uma Santai Villa",
  rent: "Daily",
  fullName: "Asya Faris",
  email: "asyafaris@gmail.com",
  phone: "+628272728290",
  guest: 2,
  status: statuses[Math.floor(Math.random() * statuses.length)],
});

const statusColors: Record<string, string> = {
  "On Negotiation": "bg-red-300 text-red-700",
  Payment: "bg-yellow-300 text-yellow-700",
  Completed: "bg-green-300 text-green-700",
  Cancelled: "bg-red-300 text-red-700",
};

export const RentPage = () => {
  const navigate = useNavigate();
  return (
    <Layout>
      {/* Header */}
      <header className="flex items-center justify-between pb-4 mb-6 border-b border-dark/30">
        <h1 className="text-2xl font-bold">Villa & Home Management</h1>

        <span className="flex items-center gap-2 px-4 py-2 rounded bg-light">
          <FaCalendar /> Today
        </span>
      </header>

      {/* Notification and filters*/}
      <div className="flex justify-between gap-8 mb-8">
        <div className="flex items-center w-full gap-1 px-1 border rounded bg-light text-primary border-dark/30">
          <IoMdNotifications size={20} />
          You have <strong>9</strong> new unchecked bookings!
        </div>
        <Button className="btn-outline">Filters</Button>
      </div>

      <table className="min-w-full bg-light">
        <thead>
          <tr className="bg-primary text-light">
            <th className="px-4 py-3 text-left">Image</th>
            <th className="px-4 py-3 text-left">Property</th>
            <th className="px-4 py-3 text-left">Rent</th>
            <th className="px-4 py-3 text-left">Full Name</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Phone</th>
            <th className="px-4 py-3 text-left">Guest</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="h-full border-b">
              <td className="px-4 py-3">
                <Img src={item.image} alt="property" className="w-12 h-12 rounded" />
              </td>
              <td className="px-4 py-3">{item.property}</td>
              <td className="px-4 py-3">{item.rent}</td>
              <td className="px-4 py-3">{item.fullName}</td>
              <td className="px-4 py-3">{item.email}</td>
              <td className="px-4 py-3">{item.phone}</td>
              <td className="px-4 py-3 text-center">{item.guest}</td>
              <td className="px-4 py-3">
                <span className={`px-4 py-1 rounded-full text-xs ${statusColors[item.status]}`}>{item.status}</span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-center gap-2">
                  <FaEdit size={20} className="cursor-pointer text-primary" onClick={() => navigate(`/dashboard/management/rent/edit/${8648712687623}`)} />
                  <IoMdLink size={20} className="cursor-pointer text-primary" />
                  <FaCheckSquare size={20} className="text-blue-600 cursor-pointer" />
                  <FaWindowClose size={20} className="text-red-600 cursor-pointer" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};
