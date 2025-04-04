import * as React from "react";

import { useGetApi, useUpdateApi } from "../../../../hooks";

import { Button, Modal, NumberInput } from "../../../../components";

import { FaEdit } from "react-icons/fa";

import { Owner } from "../../../../types";

export const EditOwnerPage = ({ ownerItem }: { ownerItem: Owner }) => {
  const [editModal, setEditModal] = React.useState<boolean>(false);
  const [owner, setOwner] = React.useState<Owner>(ownerItem);

  const [phoneNumber, setPhoneNumber] = React.useState<string>("");
  const [codePhoneNumber, setCodePhoneNumber] = React.useState<string>("");

  const { mutate: editOwner, isPending } = useUpdateApi({ key: ["edit-owner"], url: "owners", redirectPath: "/dashboard/management/owner" });

  const { data: phoneCodes } = useGetApi({ key: ["get-phone-dial-codes"], url: "regions/phone-codes" });

  const handleChange = (key: keyof Owner, value: string) => {
    setOwner((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formatData = {
      name: owner.name,
      type: owner.type,
      companyName: owner.companyName || "",
      email: owner.email,
      address: owner.address,
      phoneNumber: owner.phoneNumber,
      website: owner.website || "",
      status: owner.status,
    };
    editOwner({ id: owner.id, updatedItem: formatData });
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
            <select className="w-full input-select" value={owner.status} onChange={(e) => handleChange("status", e.target.value)}>
              <option disabled value="">
                Select status
              </option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex items-center">
            <label className="block whitespace-nowrap min-w-44">Type *</label>
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
              <label className="block whitespace-nowrap min-w-44">Phone Number *</label>
              <select className="w-full input-select" value={codePhoneNumber} onChange={(e) => setCodePhoneNumber(e.target.value)} required>
                {phoneCodes?.map((phone: any) => (
                  <option key={phone.code} value={phone.dial_code}>
                    {phone.name}
                  </option>
                ))}
              </select>
            </div>

            <NumberInput
              className="w-full max-w-lg input-text"
              value={phoneNumber}
              placeholder="894613831"
              onChange={(e) => {
                const value = e.target.value;
                if (value.length >= 16) return;
                setPhoneNumber(value);
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
