import * as React from "react";

import { useDeleteApi } from "../../../../hooks";

import { Button, Modal } from "../../../../components";

import { FaRegTrashAlt } from "react-icons/fa";

import { Owner } from "../../../../types";

export const DeleteOwnerPage = ({ ownerItem }: { ownerItem: Owner }) => {
  const [editModal, setEditModal] = React.useState<boolean>(false);

  const { mutate: deleteOwner } = useDeleteApi({ key: ["delete-owner"], url: "owners", redirectPath: "/dashboard/management/owner" });

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    deleteOwner(ownerItem.id);
  };

  return (
    <>
      <button onClick={() => setEditModal(true)}>
        <FaRegTrashAlt size={20} className="text-red-600 cursor-pointer" />
      </button>

      <Modal onClose={() => setEditModal(false)} isVisible={editModal}>
        <h2 className="heading">Delete Owner Data</h2>
        <p className="mt-2 mb-6">Are you sure you want to delete this owner {ownerItem.name}?</p>
        <div className="flex justify-end">
          <Button type="submit" className="btn-red" onClick={handleSubmit}>
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
};
