import { useGetApiWithAuth, useSearchPagination } from "../../../../hooks";

import { Layout } from "../../../../components/ui";
import { DataTable, Pagination, SearchBox, StatusBadge } from "../../../../components";
import { AddOwnerPage } from "./add-owner";
import { EditOwnerPage } from "./edit-owner";
import { DeleteOwnerPage } from "./delete-owner";

import { Data, Owner, Payload } from "../../../../types";

interface OwnersTableProps {
  owners: Owner[];
  isLoading?: boolean;
  error?: unknown;
}

const Table = ({ owners, isLoading, error }: OwnersTableProps) => {
  const columns = [
    {
      key: "name" as keyof Owner,
      header: "Full Name",
      render: (owner: Owner) => owner.name,
    },
    {
      key: "phoneNumber" as keyof Owner,
      header: "Phone Number",
      render: (owner: Owner) => owner.phoneCountryCode + owner.phoneNumber,
    },
    {
      key: "email" as keyof Owner,
      header: "Email",
      render: (owner: Owner) => owner.email,
    },
    {
      key: "type" as keyof Owner,
      header: "Type",
      render: (owner: Owner) => owner.type,
    },
    {
      key: "address" as keyof Owner,
      header: "Address",
      render: (owner: Owner) => owner.address,
    },
    {
      key: "status" as keyof Owner,
      header: "Status",
      render: (owner: Owner) => <StatusBadge status={owner.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (owner: Owner) => (
        <div className="flex items-center justify-center gap-2">
          <EditOwnerPage ownerItem={owner} />
          <DeleteOwnerPage ownerItem={owner} />
        </div>
      ),
    },
  ];

  return <DataTable data={owners} columns={columns} keyExtractor={(owner) => owner.id} isLoading={isLoading} error={error} emptyMessage="Owners not found" />;
};

export const OwnerPage = () => {
  const { searchQuery, inputValue, setInputValue, handleSearch, currentPage, handlePageChange } = useSearchPagination();

  const {
    data: respOwners,
    isPending,
    error,
  } = useGetApiWithAuth<Payload<Data<Owner[]>>>({ key: ["owners", searchQuery, currentPage], url: "owners", params: { search: searchQuery, page: currentPage } });

  const owners = respOwners?.data.data || [];
  const totalPage = respOwners?.data.meta.totalPages || 1;

  return (
    <Layout>
      {/* Header */}
      <header className="flex items-center justify-between pb-4 mb-6 border-b border-dark/30">
        <h1 className="text-2xl font-bold">Owner Management</h1>

        <div className="flex items-center gap-4">
          <AddOwnerPage />
        </div>
      </header>

      <SearchBox value={inputValue} onChange={setInputValue} onSearch={handleSearch} />

      {/* Table */}
      <div className="pb-8 mt-2 border rounded-b bg-light border-dark/30">
        <div className="pb-2 overflow-x-auto scrollbar min-h-600">
          <Table owners={owners} isLoading={isPending} error={error} />
        </div>

        {/* Pagination */}
        <Pagination page={currentPage} setPage={handlePageChange} totalPage={totalPage} isNumbering />
      </div>
    </Layout>
  );
};
