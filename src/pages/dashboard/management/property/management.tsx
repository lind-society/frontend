import * as React from "react";

import { Pagination } from "../../../../components";

import { FaWindowClose } from "react-icons/fa";

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
const packages = ["Silver", "Gold", "Platinum", "Diamond"];

const data = Array.from({ length: 35 }, (_, i) => ({
  package: packages[Math.floor(Math.random() * packages.length)],
  fullName: names[i],
  phoneNumber: `+62${Math.floor(800000000000 + Math.random() * 999999999)}`,
  email: `${names[i].toLowerCase().replace(/\s+/g, "")}@gmail.com`,
  message: "I am interested in this package. Please provide more details.",
}));

export const Management = () => {
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
    <div className="pb-8 space-y-4 border rounded-b bg-light border-dark/20">
      <div className="overflow-y-auto scrollbar">
        <table className="min-w-full bg-light">
          <thead>
            <tr className="bg-primary text-light">
              <th className="px-4 py-3 text-left">Package</th>
              <th className="px-4 py-3 text-left">Full Name</th>
              <th className="px-4 py-3 text-left">Phone Number</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Message</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {datas.map((item, index) => (
              <tr key={index} className="h-full border-b whitespace-nowrap">
                <td className="px-4 py-3">{item.package}</td>
                <td className="px-4 py-3">{item.fullName}</td>
                <td className="px-4 py-3">{item.phoneNumber}</td>
                <td className="px-4 py-3">{item.email}</td>
                <td className="px-4 py-3">{item.message}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
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
