import * as React from "react";

import { useGetApiWithAuth } from "../../../../hooks";

import { Layout } from "../../../../components/ui";
import { Pagination } from "../../../../components";
import { AddOwnerPage } from "./add-owner";
import { EditOwnerPage } from "./edit-owner";
import { DeleteOwnerPage } from "./delete-owner";

import { Data, Owner, Payload } from "../../../../types";

export const OwnerPage = () => {
  const [page, setPage] = React.useState<number>(1);

  const { data: owners, isFetching } = useGetApiWithAuth<Payload<Data<Owner[]>>>({ key: ["owners", page], url: "owners", params: { page } });

  const totalPage = owners?.data.meta.totalPages || 1;

  return (
    <Layout>
      {/* Header */}
      <header className="flex items-center justify-between pb-4 mb-6 border-b border-dark/30">
        <h1 className="text-2xl font-bold">Owner Management</h1>

        <div className="flex items-center gap-4">
          <AddOwnerPage />
        </div>
      </header>

      {/* Table */}
      <div className="pb-8 border rounded-b bg-light border-dark/30">
        <div className="mb-8 overflow-y-auto scrollbar">
          {isFetching ? (
            <div className="flex items-center justify-center min-h-200">
              <div className="loader size-12 after:size-12"></div>
            </div>
          ) : (
            <table className="min-w-full bg-light">
              <thead>
                <tr className="bg-primary text-light">
                  <th className="px-4 py-3 text-left">Full Name</th>
                  <th className="px-4 py-3 text-left">Phone Number</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Address</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {owners?.data.data.map((owner) => (
                  <tr key={owner.id} className="h-full border-b whitespace-nowrap">
                    <td className="px-4 py-3">{owner.name}</td>
                    <td className="px-4 py-3">{owner.phoneNumber}</td>
                    <td className="px-4 py-3">{owner.email}</td>
                    <td className="px-4 py-3">{owner.type}</td>
                    <td className="px-4 py-3">{owner.address}</td>
                    <td className="px-4 py-3">
                      <span className={`block w-full p-1 font-medium text-center rounded text-light ${owner.status === "active" ? "bg-green-500" : "bg-red-500"}`}>{owner.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-4">
                        <EditOwnerPage ownerItem={owner} />
                        <DeleteOwnerPage ownerItem={owner} />
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
