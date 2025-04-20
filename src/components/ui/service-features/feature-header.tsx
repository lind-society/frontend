import IconifyPicker from "@zunicornshift/mui-iconify-picker";

import { Button } from "../../button";

import { FaPenAlt, FaPlus, FaTrashAlt } from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";

import { Feature } from "../../../static";

// FeatureHeader component props
interface FeatureHeaderProps {
  feature: Feature;
  onEdit: (featureId: string, name: string) => void;
  onBlur: (featureId: string, action: "toggle" | "finish") => void;
  onAddItem: (featureId: string) => void;
  onReset: (featureId: string) => void;
  onDelete: (featureId: string) => void;
  onIconChange: (key: string | null, e: React.MouseEvent) => void;
  setIdIcon: (id: string) => void;
}

export const FeatureHeader = ({ feature, onEdit, onBlur, onAddItem, onReset, onDelete, onIconChange, setIdIcon }: FeatureHeaderProps) => (
  <div className="flex items-center justify-between min-h-10">
    {feature.isEditing ? (
      <div className="flex items-center gap-4 max-w-80">
        <input type="text" value={feature.name} onChange={(e) => onEdit(feature.id, e.target.value)} onBlur={() => onBlur(feature.id, "finish")} className="input-text" autoFocus />
        {feature.name === "" && <small className="text-red-600 whitespace-nowrap">title must be filled</small>}
      </div>
    ) : (
      <div className="flex items-center justify-between gap-4">
        <div onClick={() => setIdIcon(feature.id)}>
          <IconifyPicker onChange={onIconChange} value={feature.icon.key} />
        </div>
        <span className="font-semibold">{feature.name}</span>
        <button onClick={() => onBlur(feature.id, "toggle")}>
          <FaPenAlt />
        </button>
      </div>
    )}
    <div className="flex gap-4">
      <Button className="flex items-center gap-1 btn-primary" onClick={() => onAddItem(feature.id)}>
        <FaPlus size={12} /> Add Item
      </Button>
      <Button className="flex items-center gap-1 btn-blue" onClick={() => onReset(feature.id)}>
        <GrPowerReset color="plain" /> Reset
      </Button>
      <Button className="flex items-center gap-1 btn-red" onClick={() => onDelete(feature.id)}>
        <FaTrashAlt /> Delete
      </Button>
    </div>
  </div>
);
