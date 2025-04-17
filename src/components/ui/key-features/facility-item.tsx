import * as React from "react";

import IconifyPicker from "@zunicornshift/mui-iconify-picker";

import { GrPowerReset } from "react-icons/gr";
import { IoClose } from "react-icons/io5";

import { Facility } from "./types";

interface FacilityItemProps {
  facility: Facility;
  onUpdateField: (id: string, field: keyof Facility, value: string | boolean) => void;
  onUpdateIcon: (id: string, key: string | null, url: string) => void;
  onReset: (id: string) => void;
  onDelete: (id: string) => void;
}

export const FacilityItem: React.FC<FacilityItemProps> = ({ facility, onUpdateField, onUpdateIcon, onReset, onDelete }) => {
  const handleIconChange = (key: string | null, e: React.MouseEvent) => {
    const url = (e.target as HTMLImageElement).src;
    onUpdateIcon(facility.id, key, url);
  };

  return (
    <div className="flex items-center gap-4 px-4 py-8 border-b border-dark/30">
      <div className="space-y-2">
        <label className="block text-sm whitespace-nowrap">Icon *</label>
        <IconifyPicker onChange={handleIconChange} value={facility.icon.key} />
      </div>

      <div className="w-full space-y-1 ms-2">
        <label className="block text-sm">Title *</label>
        <input type="text" placeholder="Title" className="input-text" value={facility.name} onChange={(e) => onUpdateField(facility.id, "name", e.target.value)} readOnly />
      </div>

      <div className="space-y-0.5 mx-8">
        <label className="block text-sm whitespace-nowrap">Include Description *</label>
        <div className="flex items-center gap-8 py-2">
          <label className="flex items-center gap-2">
            Yes
            <input
              type="checkbox"
              name={`desc-${facility.id}`}
              checked={facility.includeDescription}
              onChange={() => onUpdateField(facility.id, "includeDescription", true)}
              className="accent-primary size-4"
            />
          </label>
          <label className="flex items-center gap-2">
            No
            <input
              type="checkbox"
              name={`desc-${facility.id}`}
              checked={!facility.includeDescription}
              onChange={() => onUpdateField(facility.id, "includeDescription", false)}
              className="accent-primary size-4"
            />
          </label>
        </div>
      </div>

      <div className="w-full space-y-1 max-w-60">
        <label className="block text-sm">Description *</label>
        <input
          type="text"
          placeholder="Description"
          className="input-text"
          value={facility.description}
          onChange={(e) => onUpdateField(facility.id, "description", e.target.value)}
          disabled={!facility.includeDescription}
        />
      </div>

      <div className="mx-8">
        <label className="block text-sm opacity-0">Action</label>
        <div className="flex items-center gap-8">
          <button onClick={() => onReset(facility.id)}>
            <GrPowerReset size={22} />
          </button>
          <button onClick={() => onDelete(facility.id)}>
            <IoClose size={28} />
          </button>
        </div>
      </div>
    </div>
  );
};
