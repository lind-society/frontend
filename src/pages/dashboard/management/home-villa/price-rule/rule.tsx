import * as React from "react";

import { useGetApi } from "../../../../../hooks";

import DatePicker from "react-datepicker";

import { SearchBox } from "../../../../../components/ui";
import { Button, Modal, NumberInput } from "../../../../../components";

import { FaPlus, FaRegEdit, FaTrash } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";

import { Data, Payload, PriceRule, VillaPriceRule } from "../../../../../types";

export interface FormState extends Omit<PriceRule, "discount" | "startDate" | "endDate"> {
  isEditingName: boolean;
  isAppliedToAllVilla: boolean;
  isOpenModal: boolean;
  isEditable: boolean;
  startDate: Date | null;
  endDate: Date | null;
  discount: string;
}

interface Rule {
  priceRule: FormState;
  isUpdating: boolean;
  handleEditPriceRule: (e: React.MouseEvent, priceRuleId: string) => void;
  handleDeletePriceRule: (e: React.MouseEvent, priceRuleId: string) => void;
  updateFieldPriceRule: (priceRuleId: string, key: keyof FormState, value: FormState[keyof FormState]) => void;
  deleteFieldPriceRuleVillaIds: (priceRuleId: string, villaIdsIndex: number) => void;
  handleEditToggle: (priceRuleId: string, action: "toggle" | "finish") => void;
}

const SEASONS = ["Low Season", "Regular Season", "High Season", "Peak Season"];

export const PriceRuleItem = ({ priceRule, isUpdating, deleteFieldPriceRuleVillaIds, handleDeletePriceRule, handleEditPriceRule, handleEditToggle, updateFieldPriceRule }: Rule) => {
  const [searchModalValue, setSearchModalValue] = React.useState<string>("");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const { data: respVillas, isLoading } = useGetApi<Payload<Data<VillaPriceRule[]>>>({
    key: ["get-villas-price-rule", searchQuery, priceRule.startDate, priceRule.endDate],
    url: `villa-price-rules/available-villas?startDate=${priceRule.startDate?.toISOString()}&endDate=${priceRule.endDate?.toISOString()}`,
    params: { search: searchQuery, limit: "5" },
  });

  const appliedVillas = respVillas?.data.data.filter((villa) => !priceRule.villas.some((item) => item.id === villa.id)) || [];

  const handleSearch = () => {
    setSearchQuery(searchModalValue);
  };

  return (
    <div className="relative p-6 border rounded-b bg-light border-dark/30">
      <div className={`absolute inset-0 bg-gray/30 ${priceRule.isActive ? "-z-1" : "z-5"}`}></div>
      <div className={`absolute inset-0 bg-gray/10 ${priceRule.isEditable ? "-z-1" : "z-5"}`}></div>
      <button className={`absolute top-0 right-0 p-2 bg-red-500 text-light rounded-es-2xl z-5`} onClick={(e) => handleDeletePriceRule(e, priceRule.id)}>
        <FaTrash size={14} />
      </button>
      <div className="flex items-center justify-between px-4 pb-2 border-b border-dark/30">
        {priceRule.isEditingName ? (
          <div className="flex items-center w-full gap-4 max-w-60">
            <input
              type="text"
              value={priceRule.name}
              onChange={(e) => updateFieldPriceRule(priceRule.id, "name", e.target.value)}
              onBlur={() => handleEditToggle(priceRule.id, "finish")}
              className="h-9 input-text"
              autoFocus
            />
            {priceRule.name === "" && <small className="text-red-600 whitespace-nowrap">rule title must be filled</small>}
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4 h-9">
            <span className="font-semibold">{priceRule.name}</span>
            <button onClick={() => handleEditToggle(priceRule.id, "toggle")}>
              <FaRegEdit />
            </button>
          </div>
        )}

        <div className="z-10 flex items-center gap-8">
          <div className="flex items-center gap-4">
            <label htmlFor={`isEditable-${priceRule.id}`} className="text-sm font-medium cursor-pointer text-primary">
              Edit Price
            </label>
            <div className="relative inline-block w-10 align-middle select-none">
              <input
                type="checkbox"
                id={`isEditable-${priceRule.id}`}
                checked={priceRule.isEditable}
                onChange={(e) => updateFieldPriceRule(priceRule.id, "isEditable", e.target.checked)}
                className="hidden"
              />
              <label
                htmlFor={`isEditable-${priceRule.id}`}
                className={`flex items-center overflow-hidden h-5 rounded-full border border-dark/30 cursor-pointer ${priceRule.isEditable ? "bg-primary" : "bg-light"}`}
              >
                <span
                  className={`block size-3 rounded-full shadow transform transition-transform duration-200 ease-in-out ${priceRule.isEditable ? "translate-x-6 bg-light" : "translate-x-1 bg-primary"}`}
                ></span>
              </label>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label htmlFor={`isActive-${priceRule.id}`} className="text-sm font-medium cursor-pointer text-primary">
              Activation
            </label>
            <div className="relative inline-block w-10 align-middle select-none">
              <input
                type="checkbox"
                id={`isActive-${priceRule.id}`}
                checked={priceRule.isActive}
                onChange={(e) => updateFieldPriceRule(priceRule.id, "isActive", e.target.checked)}
                className="hidden"
              />
              <label
                htmlFor={`isActive-${priceRule.id}`}
                className={`flex items-center overflow-hidden h-5 rounded-full border border-dark/30 cursor-pointer ${priceRule.isActive ? "bg-primary" : "bg-light"}`}
              >
                <span
                  className={`block size-3 rounded-full shadow transform transition-transform duration-200 ease-in-out ${priceRule.isActive ? "translate-x-6 bg-light" : "translate-x-1 bg-primary"}`}
                ></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12 px-4 my-4 md:grid-cols-3">
        <div className="space-y-2">
          <span className="block font-semibold uppercase text-primary">Season *</span>
          <select className="w-full input-select" value={priceRule.season} onChange={(e) => updateFieldPriceRule(priceRule.id, "season", e.target.value)}>
            {SEASONS.map((status, index) => (
              <option key={index} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <span className="block font-semibold uppercase text-primary">Range Date *</span>
          <div className="flex items-center w-full gap-4">
            <div className="w-full datepicker-container">
              <DatePicker
                dateFormat="dd/MM/yyyy"
                selected={priceRule.startDate}
                toggleCalendarOnIconClick
                closeOnScroll
                onChange={(date) => updateFieldPriceRule(priceRule.id, "startDate", date)}
                showIcon
                className="datepicker-input"
              />
            </div>
            <span>-</span>
            <div className="w-full datepicker-container">
              <DatePicker
                dateFormat="dd/MM/yyyy"
                selected={priceRule.endDate}
                toggleCalendarOnIconClick
                closeOnScroll
                onChange={(date) => updateFieldPriceRule(priceRule.id, "endDate", date)}
                showIcon
                className="datepicker-input"
              />
            </div>
          </div>
        </div>

        <div className="w-full space-y-2">
          <div className="flex items-center w-full gap-4">
            <span className="block font-semibold uppercase text-primary">Discount *</span>
            <div className="relative inline-block align-middle select-none w-7">
              <input
                type="checkbox"
                id={`isDiscount-${priceRule.id}`}
                checked={priceRule.isDiscount}
                onChange={(e) => updateFieldPriceRule(priceRule.id, "isDiscount", e.target.checked)}
                className="hidden"
              />
              <label
                htmlFor={`isDiscount-${priceRule.id}`}
                className={`flex items-center overflow-hidden h-4 rounded-full border border-dark/30 cursor-pointer ${priceRule.isDiscount ? "bg-primary" : "bg-light"}`}
              >
                <span
                  className={`block size-2 rounded-full shadow transform transition-transform duration-200 ease-in-out ${priceRule.isDiscount ? "translate-x-4 bg-light" : "translate-x-1 bg-primary"}`}
                ></span>
              </label>
            </div>
          </div>
          <div className="flex items-center w-full gap-2">
            <NumberInput
              className="input-text placeholder:text-dark"
              value={priceRule.isDiscount ? "0" : priceRule.discount}
              onChange={(e) => {
                if (+e.target.value > 100 || +e.target.value < 0) return;
                updateFieldPriceRule(priceRule.id, "discount", e.target.value);
              }}
              placeholder="0"
              disabled={priceRule.isDiscount}
            />
            <p>%</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-2 rounded bg-tertiary text-primary">
        <div className="flex">
          <span className="block font-semibold uppercase min-w-60">Applied to</span>
          <div className="flex items-center gap-8">
            {(["Yes", "Custom"] as const).map((status, index) => (
              <div key={index} className="flex items-center gap-2 ms-4">
                <label className="cursor-pointer" htmlFor={`${status + priceRule.id}`}>
                  {status}
                </label>
                <input
                  type="checkbox"
                  id={`${status + priceRule.id}`}
                  className="cursor-pointer accent-primary"
                  checked={priceRule.isAppliedToAllVilla === (status === "Yes")}
                  onChange={() => {
                    updateFieldPriceRule(priceRule.id, "isAppliedToAllVilla", status === "Yes");
                    if (status === "Yes") {
                      updateFieldPriceRule(priceRule.id, "villas", respVillas?.data.data || []);
                    } else {
                      if (priceRule.villas.length === respVillas?.data.data.length) {
                        updateFieldPriceRule(priceRule.id, "villas", []);
                      }
                    }
                  }}
                />
              </div>
            ))}
          </div>
          {!priceRule.isAppliedToAllVilla && (
            <button onClick={() => updateFieldPriceRule(priceRule.id, "isOpenModal", true)} className="ml-4 font-medium text-blue-500">
              Edit
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {priceRule.villas.map((v, index) => (
            <div key={v.id} className="relative px-4 py-1.5 rounded bg-primary text-light text-sm">
              <button
                onClick={() => deleteFieldPriceRuleVillaIds(priceRule.id, index)}
                className="absolute flex items-center justify-center bg-red-500 rounded-full size-4 -top-1.5 -right-1.5 z-1 hover:bg-red-700"
              >
                <IoCloseOutline className="text-light" size={14} />
              </button>
              {v.name}
            </div>
          ))}
        </div>
      </div>

      <div className={`justify-end gap-4 mt-6 ${priceRule.isEditable ? "flex" : "hidden"}`}>
        <Button className="btn-primary" onClick={(e) => handleEditPriceRule(e, priceRule.id)}>
          {isUpdating ? <div className="loader size-4 after:size-4"></div> : "Save"}
        </Button>
      </div>

      <Modal isVisible={priceRule.isOpenModal} onClose={() => updateFieldPriceRule(priceRule.id, "isOpenModal", false)}>
        <div className="mt-8 space-y-4">
          <SearchBox value={searchModalValue} onChange={setSearchModalValue} onSearch={handleSearch} />
          {isLoading ? (
            <div className="flex items-center justify-center min-h-300">
              <div className="loader size-8 after:size-8"></div>
            </div>
          ) : (
            <div className={`mt-4 border-dark/30 ${appliedVillas.length > 0 && "border-t border-b"}`}>
              {appliedVillas.map((villa) => (
                <div key={villa.id} className={`flex items-center justify-between p-2 border-dark/30 ${appliedVillas.length > 0 && "[&:not(:last-child)]:border-b"}`}>
                  <div className="flex flex-col">
                    <small>
                      {villa.city}, {villa.state}, {villa.country}
                    </small>
                    <span>{villa.name}</span>
                  </div>
                  <Button
                    onClick={() => {
                      updateFieldPriceRule(priceRule.id, "villas", [...(priceRule.villas ?? []), villa]);
                      if (appliedVillas.length === 0) {
                        updateFieldPriceRule(priceRule.id, "isOpenModal", false);
                      }
                    }}
                    className="btn-outline"
                  >
                    <FaPlus />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
