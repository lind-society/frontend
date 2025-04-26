import * as React from "react";

import { useNavigate } from "react-router-dom";

import { useDeleteApi, useGetApi } from "../../../../hooks";

import { Button, Modal } from "../../../../components";

import { FaRegTrashAlt } from "react-icons/fa";

import { Data, Payload, Package } from "../../../../types";

export const PackageTab = () => {
  const navigate = useNavigate();

  const [deleteModal, setDeleteModal] = React.useState<boolean>(false);
  const [selectedPackage, setSelectedPackage] = React.useState<Package | null>(null);

  const { data: responsePackages, isLoading } = useGetApi<Payload<Data<Package[]>>>({ key: ["get-packages"], url: "packages" });
  const { mutate: deletePackage, isPending } = useDeleteApi({ key: ["delete-package"], url: "/packages", redirectPath: "/dashboard/management/property" });

  const openDeleteModal = (packages: Package) => {
    setSelectedPackage(packages);
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
    setSelectedPackage(null);
  };

  const handleDeletePackage = (e: React.MouseEvent) => {
    e.preventDefault();
    if (selectedPackage?.id) {
      deletePackage(selectedPackage.id);
      setDeleteModal(false);
    }
  };

  return (
    <div className="p-8 border rounded-b bg-light border-dark/30">
      {isLoading ? (
        <div className="flex justify-center min-h-400">
          <div className="loader size-12 after:size-12"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 text-primary">
          {responsePackages?.data.data.map((item) => (
            <div key={item.id} className="relative p-4 space-y-4 border rounded bg-light border-primary">
              <button onClick={() => openDeleteModal(item)} className="absolute p-2 text-sm bg-red-500 rounded-full top-2 right-2 hover:bg-red-600 text-light z-1">
                <FaRegTrashAlt />
              </button>
              <h5 className="h-16 text-2xl font-semibold line-clamp-2">{item.name}</h5>
              <p className="leading-normal text-justify line-clamp-6">{item.description}</p>
              <Button onClick={() => navigate(`/dashboard/management/property/package/edit/${item.id}`)} className="w-full btn-primary">
                Edit
              </Button>
            </div>
          ))}
        </div>
      )}
      <Modal onClose={closeDeleteModal} isVisible={deleteModal}>
        <h2 className="heading">Delete Package Data</h2>
        <p className="mt-2 mb-6">Are you sure you want to delete this package "{selectedPackage?.name}"?</p>
        <div className="flex justify-end">
          <Button type="submit" className={`btn-red ${isPending && "animate-pulse"}`} onClick={handleDeletePackage}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};
