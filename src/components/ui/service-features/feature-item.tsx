import Select from "react-select";

import { NumberInput } from "../../number-input";

import { GrPowerReset } from "react-icons/gr";
import { IoClose } from "react-icons/io5";

import { Feature, ItemFeature } from "../../../static";
import { Currency, Data, OptionType, Payload } from "../../../types";

interface FeatureItemProps {
  feature: Feature;
  item: ItemFeature;
  currencies?: Payload<Data<Currency[]>>;
  onUpdateItem: (featureId: string, itemId: string, key: keyof ItemFeature, value: string | boolean | OptionType | null) => void;
  onResetItem: (featureId: string, itemId: string) => void;
  onDeleteItem: (featureId: string, itemId: string) => void;
}

export const FeatureItem = ({ feature, item, currencies, onUpdateItem, onResetItem, onDeleteItem }: FeatureItemProps) => (
  <div className="flex w-full gap-8 p-2 mt-2">
    <div className="w-full space-y-1">
      <label className="block text-sm">Title *</label>
      <input type="text" placeholder="Title" value={item.title} onChange={(e) => onUpdateItem(feature.id, item.id, "title", e.target.value)} className="input-text" required />
    </div>
    <div className="space-y-1">
      <label className="block text-sm">Free *</label>
      <div className="flex items-center gap-8 pt-1.5">
        <label className="flex items-center gap-2">
          Yes <input type="checkbox" className="accent-primary size-4" checked={item.free} onChange={() => onUpdateItem(feature.id, item.id, "free", true)} />
        </label>
        <label className="flex items-center gap-2">
          No <input type="checkbox" className="accent-primary size-4" checked={!item.free} onChange={() => onUpdateItem(feature.id, item.id, "free", false)} />
        </label>
      </div>
    </div>
    <div className="w-full space-y-1">
      <label className="block text-sm">Price *</label>
      <div className="flex items-center w-full gap-2">
        <Select
          className="w-full text-sm"
          options={currencies?.data?.data?.map((currency) => ({ value: currency.id, label: currency.code })) || []}
          value={item.currency}
          onChange={(option) => onUpdateItem(feature.id, item.id, "currency", option)}
          placeholder="Select Currency"
          isDisabled={item.free}
          required
        />
        <NumberInput
          className="input-text"
          placeholder={item.currency?.label ? `Enter currency in ${item.currency?.label}` : "Select currency first"}
          value={item.price}
          onChange={(e) => onUpdateItem(feature.id, item.id, "price", e.target.value)}
          disabled={item.free || !item.currency}
        />
      </div>
    </div>
    <div className="space-y-1">
      <label className="block text-sm opacity-0">Action</label>
      <div className="flex items-center gap-8 pt-1.5">
        <button onClick={() => onResetItem(feature.id, item.id)}>
          <GrPowerReset size={22} />
        </button>
        <button onClick={() => onDeleteItem(feature.id, item.id)}>
          <IoClose size={28} />
        </button>
      </div>
    </div>
  </div>
);
