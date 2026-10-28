import * as React from "react";

import { useNavigate } from "react-router-dom";

import { useDeleteApi, useGetApi, usePersistentData, useSearchPagination } from "../../../../hooks";

import { CardContent, Layout, SearchBox } from "../../../../components/ui";
import { Button, Modal, Pagination } from "../../../../components";

import { FaPlus } from "react-icons/fa";

import { Data, OptionType, Payload, Villa } from "../../../../types";

export const HomeVillaPage = () => {
  const navigate = useNavigate();

  const useCurrency = usePersistentData<OptionType>("selected-currency", "localStorage");
  const { data: currency } = useCurrency();

  // At most one villa can have unpublished edits pending at a time (the draft
  // store is a single global slot) — surface which one, if any.
  const useEditDraft = usePersistentData<Villa>("edit-villa");
  const { data: editDraft } = useEditDraft();
  const hasRealDraftContent = Object.entries(editDraft).some(([key, value]) => key !== "id" && Boolean(value));
  const draftVillaId = hasRealDraftContent ? editDraft.id : undefined;

  const [deleteModal, setDeleteModal] = React.useState<boolean>(false);
  const [selectedVilla, setSelectedVilla] = React.useState<Villa | null>(null);

  const { searchQuery, inputValue, setInputValue, handleSearch, currentPage, handlePageChange } = useSearchPagination();

  const { data: respVillas, isLoading } = useGetApi<Payload<Data<Villa[]>>>({
    key: ["get-villas", searchQuery, currentPage],
    url: `villas`,
    params: { search: searchQuery, page: currentPage, baseCurrencyId: currency.value },
  });
  const { mutate: deleteVilla, isPending } = useDeleteApi({ key: ["get-villas"], url: "/villas" });

  const villas = respVillas?.data.data || [];
  const totalPages = respVillas?.data.meta.totalPages || 1;

  const handleDeleteVilla = (e: React.MouseEvent) => {
    e.preventDefault();
    if (selectedVilla?.id) {
      deleteVilla(selectedVilla.id);
      setDeleteModal(false);
    }
  };

  const openDeleteModal = (villa: Villa) => {
    setSelectedVilla(villa);
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
    setSelectedVilla(null);
  };

  return (
    <Layout>
      <header className="flex items-center justify-between pb-4 mb-6 border-b border-dark/30">
        <h1 className="head-title">Villa & Home Management</h1>

        <Button onClick={() => navigate("/dashboard/management/home-villa/add")} className="flex items-center gap-2 btn-primary">
          <FaPlus /> Add New
        </Button>
      </header>

      <div className="space-y-8">
        <SearchBox value={inputValue} onChange={setInputValue} onSearch={handleSearch} />

        <CardContent isLoading={isLoading} openDeleteModal={openDeleteModal} datas={villas} type="home-villa" message={`No villa & home added yet. Click "Add New" to create one.`} draftId={draftVillaId} />

        <Pagination page={currentPage} setPage={handlePageChange} totalPage={totalPages} isNumbering />
      </div>

      <Modal onClose={closeDeleteModal} isVisible={deleteModal}>
        <h2 className="heading">Delete Villa Data</h2>
        <p className="mt-2 mb-6">Are you sure you want to delete this villa "{selectedVilla?.name}"?</p>
        <div className="flex justify-end">
          <Button type="submit" className={`btn-red ${isPending && "animate-pulse"}`} onClick={handleDeleteVilla}>
            Delete
          </Button>
        </div>
      </Modal>
    </Layout>
  );
};
