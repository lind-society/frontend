import * as React from "react";

import { useUpdateApi } from "../../../../hooks";

import { Button, Modal, NumberInput } from "../../../../components";

import { FaEdit } from "react-icons/fa";

import { deleteKeysObject } from "../../../../utils";

import { Owner } from "../../../../types";

export const EditOwnerPage = ({ ownerItem }: { ownerItem: Owner }) => {
  const [editModal, setEditModal] = React.useState<boolean>(false);
  const [owner, setOwner] = React.useState<Owner>(ownerItem);

  const { mutate: editOwner } = useUpdateApi({ key: ["edit-owner"], url: "owners", redirectPath: "/dashboard/management/owner" });

  const handleChange = (key: keyof Owner, value: string) => {
    setOwner((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ownerProcess = deleteKeysObject(owner, ["id", "activities", "properties", "villas", "createdAt", "updatedAt"]);
    editOwner({ id: owner.id, updatedItem: ownerProcess });
  };

  return (
    <>
      <button onClick={() => setEditModal(true)}>
        <FaEdit size={20} className="cursor-pointer text-primary" />
      </button>

      <Modal onClose={() => setEditModal(false)} isVisible={editModal}>
        <h2 className="heading">Edit Owner Data</h2>

        <form className="mt-6 space-y-8" onSubmit={handleSubmit}>
          {/* Property name */}
          <div className="flex items-center">
            <label className="block whitespace-nowrap min-w-60">Full Name *</label>
            <input type="text" className="input-text" value={owner.name} placeholder="Asya Faris" onChange={(e) => handleChange("name", e.target.value)} required />
          </div>
          <div className="flex items-center">
            <label className="block whitespace-nowrap min-w-60">Email *</label>
            <input type="email" className="input-text" value={owner.email} placeholder="asyafaris@gmail.com" onChange={(e) => handleChange("email", e.target.value)} required />
          </div>
          <div className="flex items-center">
            <label className="block whitespace-nowrap min-w-60">Address *</label>
            <input type="text" className="input-text" value={owner.address} placeholder="Jln. Raya Sawahan No.12" onChange={(e) => handleChange("address", e.target.value)} required />
          </div>
          <div className="flex items-center">
            <label className="block whitespace-nowrap min-w-60">Status *</label>
            <select className="w-full input-select" value={owner.status} onChange={(e) => handleChange("status", e.target.value)}>
              <option disabled value="">
                Select status
              </option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex items-center">
            <label className="block whitespace-nowrap min-w-60">Type *</label>
            <select className="w-full input-select" value={owner.type} onChange={(e) => handleChange("type", e.target.value)}>
              <option disabled value="">
                Select type
              </option>
              <option value="company">Company</option>
              <option value="private">Private</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center w-full">
              <label className="block whitespace-nowrap min-w-60">Phone Number *</label>
              <select className="w-full input-select">
                <option value="">+62</option>
                <option value="">+52</option>
                <option value="">+78</option>
              </select>
            </div>

            <NumberInput
              className="w-full max-w-lg input-text"
              value={owner.phoneNumber}
              placeholder="894613831"
              onChange={(e) => {
                const value = e.target.value;
                if (value.length >= 12) return;
                handleChange("phoneNumber", value);
              }}
              required
            />
          </div>

          <div className="flex items-center">
            <label className="block whitespace-nowrap min-w-60">Company Name</label>
            <input type="text" className="input-text" value={owner.companyName} placeholder="icodeu" onChange={(e) => handleChange("companyName", e.target.value)} />
          </div>
          <div className="flex items-center">
            <label className="block whitespace-nowrap min-w-60">Website</label>
            <input type="text" className="input-text" value={owner.website} placeholder="www.icodeu.com" onChange={(e) => handleChange("website", e.target.value)} />
          </div>

          <div className="flex justify-end gap-4">
            <Button className="btn-outline">Reset</Button>
            <Button className="btn-primary">Save</Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
