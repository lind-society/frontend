import * as React from "react";

import { Img, Pagination } from "../../../../../components";

import { FaCheckSquare, FaEdit, FaWindowClose } from "react-icons/fa";
import { IoMdLink, IoMdSearch } from "react-icons/io";

const statuses = ["On Negotiation", "Payment", "Completed", "Cancelled"];
const names = [
  "Asya Faris",
  "Dimas Pratama",
  "Nina Kusuma",
  "Rizky Aditya",
  "Sari Indah",
  "Budi Santoso",
  "Citra Melati",
  "Rendi Saputra",
  "Alya Rahma",
  "Fajar Hidayat",
  "Lina Kurnia",
  "Andi Wijaya",
  "Putri Maharani",
  "Eko Susanto",
  "Rina Amelia",
  "Bagas Prasetyo",
  "Nadia Syafira",
  "Galih Pradana",
  "Rizka Putra",
  "Vina Lestari",
  "Hendra Kusnadi",
  "Dewi Anggraini",
  "Toni Saputra",
  "Wulan Sari",
  "Bayu Firmansyah",
  "Cindy Oktaviani",
  "Dion Mahendra",
  "Mega Wulandari",
  "Arief Ramadhan",
  "Siti Rohmah",
  "Fauzan Malik",
  "Jessica Tan",
  "Reza Perdana",
  "Hesti Anindita",
  "Ilham Kurniawan",
];

const data = Array.from({ length: 35 }, (_, i) => ({
  image: "/temp.png",
  property: "Uma Santai Villa",
  rent: ["Daily", "Weekly", "Monthly"][Math.floor(Math.random() * 3)],
  fullName: names[i],
  email: `${names[i].toLowerCase().replace(/\s+/g, "")}@gmail.com`,
  phone: `+62${Math.floor(800000000000 + Math.random() * 999999999)}`,
  guest: Math.floor(Math.random() * 5) + 1,
  status: statuses[Math.floor(Math.random() * statuses.length)],
}));

const statusColors: Record<string, string> = {
  "On Negotiation": "bg-red-300 text-red-700",
  Payment: "bg-yellow-300 text-yellow-700",
  Completed: "bg-green-300 text-green-700",
  Cancelled: "bg-red-300 text-red-700",
};

export const RentManagement = () => {
  const limit = 10;
  const [datas, setDatas] = React.useState<typeof data>([]);

  const [page, setPage] = React.useState<number>(1);

  const [totalPage, setTotalPage] = React.useState<number>(Math.ceil(data.length / limit));

  React.useEffect(() => {
    const startIndex = (page - 1) * limit;
    if (data) {
      setDatas(data.slice(startIndex, startIndex + limit));
      setTotalPage(Math.ceil(data.length / limit));
    } else {
      setTotalPage(0);
    }
  }, [data, page]);

  return (
    <div className="p-8 space-y-4 border rounded-b bg-light border-dark/30">
      <h2 className="heading">Rent Management</h2>
      <div className="flex items-stretch w-full overflow-hidden border rounded border-dark/30">
        <input type="text" placeholder="Search by villa, property, or activity name" className="flex-1 px-4 py-2 text-dark placeholder-dark/30 focus:outline-none" />
        <button className="flex items-center justify-center h-10 text-light bg-primary w-14">
          <IoMdSearch size={25} />
        </button>
      </div>
      <div className="overflow-y-auto scrollbar">
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
            {datas.map((item, index) => (
              <tr key={index} className="h-full border-b whitespace-nowrap">
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
                    <FaEdit size={20} className="cursor-pointer text-primary" />
                    <IoMdLink size={20} className="cursor-pointer text-primary" />
                    <FaCheckSquare size={20} className="text-green-600 cursor-pointer" />
                    <FaWindowClose size={20} className="text-red-600 cursor-pointer" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} setPage={setPage} totalPage={totalPage} isNumbering />
    </div>
  );
};
