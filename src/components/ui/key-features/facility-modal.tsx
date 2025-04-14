// AddFacilityModal.tsx - Reusable modal component for adding facilities
import * as React from "react";

import { Button, Modal } from "../../../components";

import { FaPlus } from "react-icons/fa";

import { Facilities } from "../../../types";

interface AddFacilityModalProps {
  isVisible: boolean;
  onClose: () => void;
  availableFacilities: Facilities[];
  onAddFacility: (facilityId: string, name: string, icon: Facilities["icon"]) => void;
}

export const AddFacilityModal: React.FC<AddFacilityModalProps> = ({ isVisible, onClose, availableFacilities, onAddFacility }) => {
  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <h2 className="text-lg font-bold">Add Key Features</h2>
      <div className="mt-4 overflow-y-auto border border-dark/30">
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
