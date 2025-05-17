import * as React from "react";

import { useCreateApi, useDeleteApi, useGetApiWithAuth, useUpdateApi } from "../../../../../hooks";

import { FormState, PriceRuleItem } from "./rule";
import { Layout } from "../../../../../components/ui";
import { Button } from "../../../../../components";

import { FaPlus } from "react-icons/fa";

import { deleteKeysObject } from "../../../../../utils";

import { Data, Payload, PriceRule } from "../../../../../types";

export const PriceRulePage = () => {
  const [priceRules, setPriceRules] = React.useState<FormState[]>([]);

  const today = new Date();

  const { data: respPriceRules, isLoading: loadingPriceRule } = useGetApiWithAuth<Payload<Data<PriceRule[]>>>({ key: ["villa-price-rules"], url: "/villa-price-rules" });
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

  const handleAddPriceRule = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!window.confirm("Are you sure want to add price rule?")) return;
    const newDataPriceRule = {
      id: crypto.randomUUID(),
      name: `Rules ${priceRules.length + 1}`,
      startDate: today.toDateString(),
      endDate: today.toDateString(),
      season: "Low Season",
      isDiscount: true,
      discount: "",
      isActive: true,
      isEditingName: false,
      isEditable: false,
      isCustomApplied: false,
      isOpenModal: false,
      villaIds: [],
      villas: [],
    };
    const processData = deleteKeysObject(newDataPriceRule, ["id", "isEditingName", "isCustomApplied", "isOpenModal", "isEditable", "villas", "currency", "isAppliedToAllVilla"]);
    createPriceRule({ ...processData, discount: 0 });
  };

  const handleEditPriceRule = (e: React.MouseEvent, priceRuleId: string) => {
    e.preventDefault();
    const priceRule = priceRules.find((item) => item.id === priceRuleId);
    const processData = deleteKeysObject(priceRule, ["id", "isEditingName", "isCustomApplied", "isOpenModal", "isEditable", "createdAt", "updatedAt", "villas", "currency", "isAppliedToAllVilla"]);

    updatePriceRule({
      id: priceRule?.id || "",
      updatedItem: {
        ...processData,
        startDate: priceRule?.startDate?.toDateString(),
        endDate: priceRule?.endDate?.toDateString(),
        discount: priceRule?.isDiscount ? 0 : +priceRule?.discount!,
        villaIds: priceRule?.villas.map((item) => item.id) || [],
      },
    });
  };

  const handleDeletePriceRule = (e: React.MouseEvent, priceRuleId: string) => {
    e.preventDefault();
    if (!window.confirm("Are you sure want to delete this price rule?")) return;
    deletePriceRule(priceRuleId);
  };

  const updateFieldPriceRule = (priceRuleId: string, key: keyof FormState, value: FormState[keyof FormState]) => {
    setPriceRules((prevPriceRules) => prevPriceRules.map((priceRule) => (priceRule.id === priceRuleId ? { ...priceRule, [key]: value } : priceRule)));
  };

  const deleteFieldPriceRuleVillaIds = (priceRuleId: string, villaIdsIndex: number) => {
    setPriceRules((prevPriceRules) =>
      prevPriceRules.map((priceRule) =>
        priceRule.id === priceRuleId
          ? { ...priceRule, villaIds: priceRule.villaIds.filter((_, index) => index !== villaIdsIndex), villas: priceRule.villas.filter((_, index) => index !== villaIdsIndex) }
          : priceRule
      )
    );
  };

  const handleEditToggle = (priceRuleId: string, action: "toggle" | "finish") => {
    setPriceRules((prevPriceRules) =>
      prevPriceRules.map((priceRule) =>
        priceRule.id === priceRuleId
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
        <h1 className="head-title">Price Rules Villa Management</h1>

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
          <div className="space-y-4">
            {priceRules.map((priceRule) => {
              return (
                <PriceRuleItem
                  key={priceRule.id}
                  isUpdating={isUpdating}
                  priceRule={priceRule}
                  handleEditToggle={handleEditToggle}
                  updateFieldPriceRule={updateFieldPriceRule}
                  deleteFieldPriceRuleVillaIds={deleteFieldPriceRuleVillaIds}
                  handleEditPriceRule={handleEditPriceRule}
                  handleDeletePriceRule={handleDeletePriceRule}
                />
              );
            })}
          </div>
        </div>
      )}
    </Layout>
  );
};
