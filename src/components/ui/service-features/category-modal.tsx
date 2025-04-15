import { Button } from "../../button";
import { Modal } from "../../modal";

import { FaPlus } from "react-icons/fa";

import { Feature } from "../../../static";

// CategoryModal component props
interface CategoryModalProps {
  isVisible: boolean;
  onClose: () => void;
  otherFeatures: Feature[];
  onAddOtherFeature: (name: string, icon: Feature["icon"]) => void;
  onAddNewCategory: () => void;
}

export const CategoryModal = ({ isVisible, onClose, otherFeatures, onAddOtherFeature, onAddNewCategory }: CategoryModalProps) => (
  <Modal isVisible={isVisible} onClose={onClose}>
    <h2 className="text-lg font-bold">Add New Category</h2>
    <div className={`mt-4 border-dark/30 ${otherFeatures.length > 0 && "border"}`}>
      {otherFeatures.map((feature, index) => (
        <div key={index} className={`flex items-center justify-between p-2 border-dark/30 ${otherFeatures.length > 0 && "[&:not(:last-child)]:border-b"}`}>
          <span>{feature.name}</span>
          <Button onClick={() => onAddOtherFeature(feature.name, feature.icon)} className="btn-outline">
            <FaPlus />
          </Button>
        </div>
      ))}
    </div>
    <div className={`items-center w-full my-6 ${otherFeatures.length > 0 ? "flex" : "hidden"}`}>
      <div className="flex-grow h-px bg-dark/30"></div>
      <span className="flex-shrink-0 px-3 text-sm text-dark">or</span>
      <div className="flex-grow h-px bg-dark/30"></div>
    </div>
    <Button onClick={onAddNewCategory} className="flex items-center justify-center w-full gap-2 btn-primary">
      <FaPlus /> Add new category
    </Button>
  </Modal>
);
