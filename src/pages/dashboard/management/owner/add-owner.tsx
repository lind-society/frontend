import * as React from "react";

import { useCreateApi, useGetApi } from "../../../../hooks";

import { Button, Modal, NumberInput } from "../../../../components";

import { FaPlus } from "react-icons/fa";

import { deleteKeysObject } from "../../../../utils";

import { Owner } from "../../../../types";

const initValue = { name: "", type: "", companyName: "", email: "", phoneNumber: "", address: "", website: "", status: "" };

export const AddOwnerPage = () => {
  const [addModal, setAddModal] = React.useState<boolean>(false);
  const [owner, setOwner] = React.useState<Partial<Owner>>(initValue);

  const { mutate: addOwner, isPending } = useCreateApi({ key: ["add-owner"], url: "owners", redirectPath: "/dashboard/management/owner" });

  const { data: phoneCodes } = useGetApi({ key: ["get-phone-dial-codes"], url: "regions/phone-codes" });

  const handleChange = (key: keyof Owner, value: string) => {
    setOwner((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ownerProcess = deleteKeysObject(owner, ["id", "activities", "properties", "villas", "createdAt", "updatedAt"]);
    addOwner(ownerProcess);
    setOwner(initValue);
  };

  return (
    <>
      <Button className="flex items-center gap-2 btn-primary" onClick={() => setAddModal(true)}>
        <FaPlus /> Add Owner
      </Button>
      <Modal onClose={() => setAddModal(false)} isVisible={addModal}>
        <h2 className="heading">Add Owner Data</h2>

        <form className="mt-6 space-y-8" onSubmit={handleSubmit}>
          {/* Property name */}
          <div className="flex items-center">
            <label className="block whitespace-nowrap min-w-44">Full Name *</label>
            <input type="text" className="input-text" value={owner.name} placeholder="Asya Faris" onChange={(e) => handleChange("name", e.target.value)} required />
          </div>
          <div className="flex items-center">
            <label className="block whitespace-nowrap min-w-44">Email *</label>
            <input type="email" className="input-text" value={owner.email} placeholder="asyafaris@gmail.com" onChange={(e) => handleChange("email", e.target.value)} required />
          </div>
          <div className="flex items-center">
            <label className="block whitespace-nowrap min-w-44">Address *</label>
            <input type="text" className="input-text" value={owner.address} placeholder="Jln. Raya Sawahan No.12" onChange={(e) => handleChange("address", e.target.value)} required />
          </div>
          <div className="flex items-center">
            <label className="block whitespace-nowrap min-w-44">Status *</label>
            <select className="w-full input-select" value={owner.status} onChange={(e) => handleChange("status", e.target.value)} required>
              <option disabled value="">
                Select status
              </option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex items-center">
            <label className="block whitespace-nowrap min-w-44">Type *</label>
            <select className="w-full input-select" value={owner.type} onChange={(e) => handleChange("type", e.target.value)} required>
              <option disabled value="">
                Select type
              </option>
              <option value="company">Company</option>
              <option value="private">Private</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center w-full">
              <label className="block whitespace-nowrap min-w-44">Phone Number *</label>
              <select className="w-full input-select" value={owner.phoneCountryCode} onChange={(e) => handleChange("phoneCountryCode", e.target.value)} required>
                {phoneCodes?.map((phone: any) => (
                  <option key={phone.code} value={phone.dial_code}>
                    {phone.name} ({phone.dial_code})
                  </option>
                ))}
              </select>
            </div>

            <NumberInput
              className="w-full max-w-lg input-text"
              value={owner.phoneNumber}
              placeholder="894613831"
              onChange={(e) => {
                const value = e.target.value;
                if (value.length >= 16) return;
                handleChange("phoneNumber", e.target.value);
              }}
              required
            />
          </div>

          <div className="flex items-center">
            <label className="block whitespace-nowrap min-w-44">Company Name</label>
            <input type="text" className="input-text" value={owner.companyName} placeholder="icodeu" onChange={(e) => handleChange("companyName", e.target.value)} />
          </div>
          <div className="flex items-center">
            <label className="block whitespace-nowrap min-w-44">Website</label>
            <input type="text" className="input-text" value={owner.website} placeholder="www.icodeu.com" onChange={(e) => handleChange("website", e.target.value)} />
          </div>

          <div className="flex justify-end gap-4">
            <Button className="btn-outline">Reset</Button>
            <Button className="btn-primary">{isPending ? <div className="loader size-5 after:size-5"></div> : "Save"}</Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
