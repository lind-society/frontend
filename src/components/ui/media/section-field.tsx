import { Img, Button } from "../../../components";

import { FaPlus, FaUpload } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";

import { Field } from "./types";

interface SectionFieldProps {
  field: Field;
  sectionTitle: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onUpdateImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (imgIndex: number) => void;
  onReset: (e: React.MouseEvent) => void;
  onAdd: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  canDelete: boolean;
  isLoading: boolean;
}

export const SectionField = ({ field, sectionTitle, onNameChange, onDescriptionChange, onUpdateImage, onRemoveImage, onAdd, onReset, onDelete, canDelete, isLoading }: SectionFieldProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <label className="whitespace-nowrap min-w-60">Name*</label>
        <input type="text" placeholder={sectionTitle} value={field.name} onChange={(e) => onNameChange(e.target.value)} className="input-text" />
        <label className="px-8 whitespace-nowrap">Description*</label>
        <input type="text" placeholder="King bed, Single bed, Bathroom" value={field.description} onChange={(e) => onDescriptionChange(e.target.value)} className="input-text" />
      </div>

      <div className="flex items-center pt-1">
        <label className="whitespace-nowrap min-w-60">Photo*</label>
        <div className="relative">
          <input type="file" id={field.id} onChange={onUpdateImage} hidden accept="image/*" multiple disabled={isLoading} />
          <label htmlFor={field.id} className="file-label">
            <FaUpload /> {isLoading ? "Waiting..." : "Browse"}
          </label>
        </div>
        <span className="pl-2 text-sm text-primary whitespace-nowrap">Max. 5mb</span>
      </div>

      <div className="grid grid-cols-4 gap-2.5 pt-2">
        {field.photos.map((image, index) => (
          <div key={index} className="relative">
            <button onClick={() => onRemoveImage(index)} type="button" className="btn-close">
              <IoCloseOutline className="text-light" />
            </button>
            <Img src={image || "/temp-business.webp"} alt={`Selected image ${index + 1}`} className="w-full h-48 rounded" />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Button type="button" onClick={onReset} className="w-full btn-outline">
          Reset
        </Button>
        <Button type="button" onClick={onDelete} className="w-full btn-red" disabled={!canDelete}>
          Delete
        </Button>
        <Button type="button" onClick={onAdd} className="flex items-center justify-center w-full gap-2 btn-primary">
          <FaPlus /> Add More
        </Button>
      </div>
    </div>
  );
};
