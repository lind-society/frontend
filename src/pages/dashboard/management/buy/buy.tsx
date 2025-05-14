import * as React from "react";

import { useNavigate } from "react-router-dom";

import { useDeleteApi, useGetApi, usePersistentData, useSearchPagination } from "../../../../hooks";

import { CardContent, Layout, SearchBox } from "../../../../components/ui";
import { Button, Modal, Pagination } from "../../../../components";

import { FaPlus } from "react-icons/fa";

import { Data, OptionType, Payload, Property } from "../../../../types";

export const BuyPage = () => {
  const navigate = useNavigate();

  const useCurrency = usePersistentData<OptionType>("selected-currency", "localStorage");
  const { data: currency } = useCurrency();

  const [deleteModal, setDeleteModal] = React.useState<boolean>(false);
  const [selectedProperty, setSelectedProperty] = React.useState<Property | null>(null);

  const { searchQuery, inputValue, setInputValue, handleSearch, currentPage, handlePageChange } = useSearchPagination();

  const { data: respProperties, isLoading } = useGetApi<Payload<Data<Property[]>>>({
    key: ["get-properties", searchQuery, currentPage],
    url: "properties",
    params: { search: searchQuery, page: currentPage, baseCurrencyId: currency.value },
  });

  const { mutate: deleteProperty, isPending } = useDeleteApi({
    key: ["delete-property"],
    url: "/properties",
    redirectPath: "/dashboard/management/buy",
  });

  const properties = respProperties?.data.data || [];
  const totalPages = respProperties?.data.meta.totalPages || 1;

  const handleDeleteProperty = (e: React.MouseEvent) => {
    e.preventDefault();
    if (selectedProperty?.id) {
      deleteProperty(selectedProperty.id);
      setDeleteModal(false);
    }
  };

  const openDeleteModal = (property: Property) => {
    setSelectedProperty(property);
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
    setSelectedProperty(null);
  };

  return (
    <Layout>
      {/* Header */}
      <header className="flex items-center justify-between pb-4 mb-6 border-b border-dark/30">
        <h1 className="head-title">Buy Management</h1>

        <Button onClick={() => navigate("/dashboard/management/buy/add")} className="flex items-center gap-2 btn-primary">
          <FaPlus /> Add New
        </Button>
      </header>

      <div className="space-y-8">
        <SearchBox value={inputValue} onChange={setInputValue} onSearch={handleSearch} />

        <CardContent isLoading={isLoading} openDeleteModal={openDeleteModal} datas={properties} type="buy" />

        <Pagination page={currentPage} setPage={handlePageChange} totalPage={totalPages} isNumbering />
      </div>

      <Modal onClose={closeDeleteModal} isVisible={deleteModal}>
        <h2 className="heading">Delete Property Data</h2>
        <p className="mt-2 mb-6">Are you sure you want to delete this property "{selectedProperty?.name}"?</p>
        <div className="flex justify-end">
          <Button type="submit" className={`btn-red ${isPending && "animate-pulse"}`} onClick={handleDeleteProperty}>
            Delete
          </Button>
        </div>
      </Modal>
    </Layout>
  );
};
