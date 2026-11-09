// AddFacilityModal.tsx - Reusable modal component for adding facilities
import * as React from "react";

import { useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

import { Button, Modal } from "../../../components";

import { FaPlus } from "react-icons/fa";

import { API } from "../../../utils/api";

import { Facilities } from "../../../types";

interface AddFacilityModalProps {
  isVisible: boolean;
  onClose: () => void;
  availableFacilities: Facilities[];
  onAddFacility: (facilityId: string, name: string, icon: Facilities["icon"]) => void;
}

export const AddFacilityModal: React.FC<AddFacilityModalProps> = ({
  isVisible,
  onClose,
  availableFacilities,
  onAddFacility,
}) => {
  const queryClient = useQueryClient();

  const [title, setTitle] = React.useState("");
  const [isCreating, setIsCreating] = React.useState(false);

  // A new key feature can be named right here, so the list is never a dead end
  // (a fresh database has no features to pick from).
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = title.trim();
    if (!name) return;

    setIsCreating(true);
    try {
      const { data } = await API.post("/facilities", { name, type: "optional" });
      const created = data?.data;

      await queryClient.invalidateQueries({ queryKey: ["facilities"] });
      if (created?.id) onAddFacility(created.id, created.name ?? name, created.icon ?? null);

      setTitle("");
      toast.success("Key feature created");
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message;
      toast.error(message || "Failed to create the key feature");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <h2 className="text-lg font-bold">Add Key Features</h2>

      <form className="flex items-center gap-3 mt-4" onSubmit={handleCreate}>
        <input
          type="text"
          className="input-text"
          placeholder="New feature title, e.g. Private Pool"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="New feature title"
        />
        <Button type="submit" className="btn-primary whitespace-nowrap" disabled={isCreating || !title.trim()}>
          Create &amp; add
        </Button>
      </form>

      <div className="mt-4 overflow-y-auto border border-dark/30">
        {availableFacilities?.length === 0 && <p className="p-3 text-dark/60">No other features yet.</p>}
        {availableFacilities?.map((facility, index) => (
          <div key={index} className="flex items-center justify-between p-2 border-b border-dark/30">
            <span>{facility.name}</span>
            <Button onClick={() => onAddFacility(facility.id, facility.name, facility.icon)} className="btn-outline">
              <FaPlus />
            </Button>
          </div>
        ))}
      </div>
    </Modal>
  );
};
