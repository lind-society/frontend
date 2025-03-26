import * as React from "react";

// import { useNavigate } from "react-router-dom";

import { useGetApiWithAuth } from "../../../../hooks";

import { Layout } from "../../../../components/ui";
import { Button, Pagination } from "../../../../components";

import { FaEdit, FaPlus, FaRegTrashAlt } from "react-icons/fa";
// import { IoMdLink } from "react-icons/io";

import { Data, Owner, Payload } from "../../../../types";

export const OwnerPage = () => {
  // const navigate = useNavigate();
  const [page, setPage] = React.useState<number>(1);

  // Fetch data with pagination
  const { data: owners, isFetching } = useGetApiWithAuth<Payload<Data<Owner[]>>>({
    key: ["owners", page],
    url: "owners",
    params: { page },
  });

  // Determine total pages from API response
  const totalPage = owners?.data.meta.totalPages || 1;

  return (
    <Layout>
      {/* Header */}
      <header className="flex items-center justify-between pb-4 mb-6 border-b border-dark/30">
        <h1 className="text-2xl font-bold">Owner Management</h1>

        <div className="flex items-center gap-4">
          {/* <Button className="flex items-center gap-2 btn-primary">
            <IoMdLink /> Generate Form
          </Button> */}
          <Button className="flex items-center gap-2 btn-primary">
            <FaPlus /> Add Owner
          </Button>
        </div>
      </header>

      {/* Table */}
      <div className="pb-8 border rounded-b bg-light border-dark/30">
        <div className="mb-8 overflow-y-auto scrollbar">
          {isFetching ? (
            <div className="flex items-center justify-center min-h-200">
              <div className="loader"></div>
            </div>
          ) : (
            <table className="min-w-full bg-light">
              <thead>
                <tr className="bg-primary text-light">
                  <th className="px-4 py-3 text-left">Full Name</th>
                  <th className="px-4 py-3 text-left">Phone Number</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Property Name</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {owners?.data.data.map((owner) => (
                  <tr key={owner.id} className="h-full border-b whitespace-nowrap">
                    <td className="px-4 py-3">{owner.name}</td>
                    <td className="px-4 py-3">{owner.phoneNumber}</td>
                    <td className="px-4 py-3">{owner.email}</td>
                    <td className="px-4 py-3">{owner.companyName}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-4">
                        <FaEdit size={20} className="cursor-pointer text-primary" />
                        <FaRegTrashAlt size={20} className="text-red-600 cursor-pointer" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <Pagination page={page} setPage={setPage} totalPage={totalPage} isNumbering />
      </div>
    </Layout>
  );
};
