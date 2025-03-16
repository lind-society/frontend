import * as React from "react";

import { Layout } from "../../../../components/ui";

import { Button, Img, Pagination } from "../../../../components";

import { useNavigate } from "react-router-dom";

import { FaEdit, FaRegTrashAlt } from "react-icons/fa";

import { IoMdLink } from "react-icons/io";

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
  fullName: names[i],
  nik_id: `${Math.floor(1000000000000000 + Math.random() * 8999999999999999)}`,
  phoneNumber: `+62${Math.floor(800000000000 + Math.random() * 999999999)}`,
  waNumber: `+62${Math.floor(800000000000 + Math.random() * 999999999)}`,
  email: `${names[i].toLowerCase().replace(/\s+/g, "")}@gmail.com`,
  propertyName: "Uma Santai Villa",
  idPhoto: "/temp.png",
}));

export const OwnerPage = () => {
  const navigate = useNavigate();

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
    <Layout>
      {/* Header */}
      <header className="flex items-center justify-between pb-4 mb-6 border-b border-dark/20">
        <h1 className="text-2xl font-bold">Owner Management</h1>

        <div className="flex items-center gap-4">
          <Button className="flex items-center gap-2 btn-primary">
            <IoMdLink /> Generate Form
          </Button>
          <Button className="flex items-center gap-2 btn-primary">+ Add Owner</Button>
        </div>
      </header>
      <div className="pb-8 border rounded-b bg-light border-dark/20">
        <div className="overflow-y-auto scrollbar">
          <table className="min-w-full bg-light">
            <thead>
              <tr className="bg-primary text-light">
                <th className="px-4 py-3 text-left">Image</th>
                <th className="px-4 py-3 text-left">Full Name</th>
                <th className="px-4 py-3 text-left">NIK / ID</th>
                <th className="px-4 py-3 text-left">Phone Number</th>
                <th className="px-4 py-3 text-left">Wa Number</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Property Name</th>
                <th className="px-4 py-3 text-left">ID Photo</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {datas.map((item, index) => (
                <tr key={index} className="h-full border-b whitespace-nowrap">
                  <td className="px-4 py-3">
                    <Img src={item.image} alt="property" className="w-12 h-12 rounded-md" />
                  </td>
                  <td className="px-4 py-3">{item.fullName}</td>
                  <td className="px-4 py-3">{item.nik_id}</td>
                  <td className="px-4 py-3">{item.phoneNumber}</td>
                  <td className="px-4 py-3">{item.waNumber}</td>
                  <td className="px-4 py-3">{item.email}</td>
                  <td className="px-4 py-3">{item.propertyName}</td>
                  <td className="px-4 py-3">
                    <Img src={item.idPhoto} alt="property" className="w-12 h-12 rounded-md" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <FaEdit size={20} className="cursor-pointer text-primary" onClick={() => navigate(`/dashboard/management/owner/edit/${8648712687623}`)} />
                      <FaRegTrashAlt size={20} className="text-red-600 cursor-pointer" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} setPage={setPage} totalPage={totalPage} isNumbering />
      </div>
    </Layout>
  );
};
