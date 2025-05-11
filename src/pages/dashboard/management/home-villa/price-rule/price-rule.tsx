import * as React from "react";

import DatePicker from "react-datepicker";

import { Button, Modal, NumberInput } from "../../../../../components";
import { Layout, SearchBox } from "../../../../../components/ui";

import { FaPlus, FaRegEdit, FaTrash } from "react-icons/fa";
import { Data, Payload, PriceRule, Villa } from "../../../../../types";
import { useCreateApi, useDeleteApi, useGetApi, useGetApiWithAuth, useUpdateApi } from "../../../../../hooks";
import { deleteKeysObject } from "../../../../../utils";
import { IoCloseOutline } from "react-icons/io5";

interface FormState extends Omit<PriceRule, "discount" | "startDate" | "endDate"> {
  isEditingName: boolean;
  isCustomApplied: boolean;
  isOpenModal: boolean;
  isEditable: boolean;
  startDate: Date | null;
  endDate: Date | null;
  discount: string;
}

const SEASONS = ["Low Season", "Normal Season", "High Season", "Peak Season"];

export const PriceRulePage = () => {
  const [priceRules, setPriceRules] = React.useState<FormState[]>([]);
  const [searchModalValue, setSearchModalValue] = React.useState<string>("");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const today = new Date();

  const { data: respPriceRules, isLoading: loadingPriceRule } = useGetApiWithAuth<Payload<Data<PriceRule[]>>>({ key: ["villa-price-rules"], url: "/villa-price-rules" });
  const { data: respVillas, isLoading: loadingVillas } = useGetApi<Payload<Data<Villa[]>>>({ key: ["get-villas-price-rule", searchQuery], url: `villas`, params: { search: searchQuery, limit: "5" } });

  const { mutate: createPriceRule, isPending: isCreating } = useCreateApi<Partial<PriceRule>>({
    key: ["add-villa-price-rules"],
    url: "/villa-price-rules",
    redirectPath: "/dashboard/management/price-rule-villa",
  });
  const { mutate: updatePriceRule, isPending: isUpdating } = useUpdateApi<Partial<PriceRule>>({
    key: ["update-villa-price-rules"],
    url: "/villa-price-rules",
    redirectPath: "/dashboard/management/price-rule-villa",
  });
  const { mutate: deletePriceRule } = useDeleteApi({ key: ["delete-villa-price-rules"], url: "/villa-price-rules", redirectPath: "/dashboard/management/price-rule-villa" });

  const handleSearch = React.useCallback(() => {
    setSearchQuery(searchModalValue);
  }, [searchModalValue]);

  const handleAddPriceRule = () => {
    if (!window.confirm("Are you sure want to add price rule?")) return;
    const newDataPriceRule = {
      id: crypto.randomUUID(),
      name: "Rules 1",
      startDate: today.toISOString() || null,
      endDate: today.toISOString() || null,
      season: SEASONS[0],
      isDiscount: true,
      discount: "",
      isActive: true,
      isEditingName: true,
      isEditable: false,
      isCustomApplied: false,
      isOpenModal: false,
      villaIds: [],
      villas: [],
    };
    const processData = deleteKeysObject(newDataPriceRule, ["id", "isEditingName", "isCustomApplied", "isOpenModal", "isEditable", "villas"]);
    createPriceRule({ ...processData, discount: 0 });
  };

  const handleEditPriceRule = (e: React.MouseEvent, ruleId: string) => {
    e.preventDefault();
    const priceRule = priceRules.find((item) => item.id === ruleId);
    const processData = deleteKeysObject(priceRule, ["id", "isEditingName", "isCustomApplied", "isOpenModal", "isEditable", "createdAt", "updatedAt", "villas"]);

    updatePriceRule({
      id: priceRule?.id || "",
      updatedItem: {
        ...processData,
        startDate: priceRule?.startDate?.toISOString() || null,
        endDate: priceRule?.endDate?.toISOString() || null,
        discount: +priceRule?.discount! || 0,
      },
    });
  };

  const handleDeletePriceRule = (e: React.MouseEvent, ruleId: string) => {
    e.preventDefault();
    deletePriceRule(ruleId);
  };

  const updateFieldPriceRule = (ruleId: string, key: keyof FormState, value: FormState[keyof FormState]) => {
    setPriceRules((prevPriceRules) => prevPriceRules.map((priceRule) => (priceRule.id === ruleId ? { ...priceRule, [key]: value } : priceRule)));
  };

  const deleteFieldPriceRuleVillaIds = (ruleId: string, villaIdsIndex: number) => {
    setPriceRules((prevPriceRules) =>
      prevPriceRules.map((priceRule) =>
        priceRule.id === ruleId
          ? { ...priceRule, villaIds: priceRule.villaIds.filter((_, index) => index !== villaIdsIndex), villas: priceRule.villas.filter((_, index) => index !== villaIdsIndex) }
          : priceRule
      )
    );
  };

  const handleEditToggle = (ruleId: string, action: "toggle" | "finish") => {
    setPriceRules((prevPriceRules) =>
      prevPriceRules.map((priceRule) =>
        priceRule.id === ruleId
          ? action === "toggle"
            ? { ...priceRule, isEditingName: !priceRule.isEditingName }
            : priceRule.name !== ""
            ? { ...priceRule, isEditingName: false }
            : priceRule
          : priceRule
      )
    );
  };

  React.useEffect(() => {
    if (respPriceRules) {
      const priceRules = respPriceRules.data.data.map((priceRule) => ({
        ...priceRule,
        isEditingName: false,
        isCustomApplied: false,
        isEditable: false,
        isOpenModal: false,
        startDate: new Date(priceRule.startDate),
        endDate: new Date(priceRule.endDate),
        villaIds: priceRule.villas.map((item) => item.id),
        discount: priceRule.discount.toString(),
      }));
      setPriceRules(priceRules);
    }
  }, [respPriceRules]);

  return (
    <Layout>
      <header className="flex items-center justify-between pb-4 mb-6 border-b border-dark/30">
        <h1 className="head-title">Villa & Home Management</h1>

        <Button onClick={handleAddPriceRule} className="flex items-center gap-2 btn-primary">
          {isCreating ? (
            <div className="loader size-4 after:size-4"></div>
          ) : (
            <>
              <FaPlus /> Add New Rules
            </>
          )}
        </Button>
      </header>

      {loadingPriceRule ? (
        <div className="flex items-center justify-center min-h-400 bg-light">
          <div className="loader size-16 after:size-16"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {priceRules.length === 0 ? (
            <div className="relative p-8 border rounded-b bg-light border-dark/30">
              <p className="flex items-center justify-center text-center text-dark/50 min-h-200">No one has add price rules</p>
            </div>
          ) : (
            <div className="space-y-4">
              {priceRules.map((priceRule) => {
                const appliedVillas = respVillas?.data.data.filter((villa) => !priceRule.villas.some((item) => item.id === villa.id));
                return (
                  <div key={priceRule.id} className="relative p-6 border rounded-b bg-light border-dark/30">
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
                                className={`block size-3 rounded-full shadow transform transition-transform duration-200 ease-in-out ${
                                  priceRule.isEditable ? "translate-x-6 bg-light" : "translate-x-1 bg-primary"
                                }`}
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
                                className={`block size-3 rounded-full shadow transform transition-transform duration-200 ease-in-out ${
                                  priceRule.isActive ? "translate-x-6 bg-light" : "translate-x-1 bg-primary"
                                }`}
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
                                className={`block size-2 rounded-full shadow transform transition-transform duration-200 ease-in-out ${
                                  priceRule.isDiscount ? "translate-x-4 bg-light" : "translate-x-1 bg-primary"
                                }`}
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
                                checked={priceRule.isCustomApplied === (status === "Yes")}
                                onChange={() => updateFieldPriceRule(priceRule.id, "isCustomApplied", status === "Yes")}
                              />
                            </div>
                          ))}
                        </div>
                        {!priceRule.isCustomApplied && (
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
                        {loadingVillas ? (
                          <div className="flex items-center justify-center min-h-300">
                            <div className="loader size-8 after:size-8"></div>
                          </div>
                        ) : (
                          <>
                            {appliedVillas?.length! < 1 ? (
                              <p className="flex items-center justify-center text-center text-dark/50 min-h-300">Villa has been applied all</p>
                            ) : (
                              <div className={`mt-4 border-dark/30 ${appliedVillas?.length! > 0 && "border-t border-b"}`}>
                                {appliedVillas?.map((villa) => (
                                  <div key={villa.id} className={`flex items-center justify-between p-2 border-dark/30 ${appliedVillas?.length! > 0 && "[&:not(:last-child)]:border-b"}`}>
                                    <div className="flex flex-col">
                                      <small>
                                        {villa.city}, {villa.state}, {villa.country}
                                      </small>
                                      <span>{villa.name}</span>
                                    </div>
                                    <Button onClick={() => updateFieldPriceRule(priceRule.id, "villas", [...(priceRule.villas ?? []), villa])} className="btn-outline">
                                      <FaPlus />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </Modal>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};
