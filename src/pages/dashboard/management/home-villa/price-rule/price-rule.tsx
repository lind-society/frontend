import * as React from "react";

import { useCreateApi, useDeleteApi, useGetApiWithAuth, useUpdateApi } from "../../../../../hooks";

import { FormState, PriceRuleItem } from "./rule";
import { Layout } from "../../../../../components/ui";
import { Button } from "../../../../../components";

import toast from "react-hot-toast";

import { FaPlus } from "react-icons/fa";

import { Data, Payload, PriceRule } from "../../../../../types";

export const PriceRulePage = () => {
  const [priceRules, setPriceRules] = React.useState<FormState[]>([]);

  const today = new Date();

  // `currencyId` is required by the API. The topbar already persists the
  // dashboard's working currency, so the rule inherits it.
  //
  // Read straight from storage rather than through `usePersistentData`: that
  // helper builds a brand new zustand store on every call, and a second store
  // on the same key fights the topbar's instance into an infinite render loop.
  const currencyId = React.useMemo(() => {
    try {
      const raw = localStorage.getItem("selected-currency");
      return raw ? (JSON.parse(raw)?.state?.data?.value as string | undefined) : undefined;
    } catch {
      return undefined;
    }
  }, []);

  const { data: respPriceRules, isLoading: loadingPriceRule } = useGetApiWithAuth<Payload<Data<PriceRule[]>>>({ key: ["villa-price-rules"], url: "/villa-price-rules" });
  const { mutate: createPriceRule, isPending: isCreating } = useCreateApi<Partial<PriceRule>>({
    key: ["villa-price-rules"],
    url: "/villa-price-rules",
  });
  const { mutate: updatePriceRule, isPending: isUpdating } = useUpdateApi<Partial<PriceRule>>({
    key: ["villa-price-rules"],
    url: "/villa-price-rules",
  });
  const { mutate: deletePriceRule } = useDeleteApi({ key: ["villa-price-rules"], url: "/villa-price-rules" });

  const handleAddPriceRule = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!currencyId) {
      toast.error("Pilih mata uang dulu di bagian atas dashboard.");
      return;
    }

    if (!window.confirm("Are you sure want to add price rule?")) return;

    // A brand new rule carries no discount at all. Sending `isDiscount: true`
    // with a zero amount made the API derive a percentage discount type and
    // then reject 0 as out of the 1-100 range.
    createPriceRule({
      name: `Rules ${priceRules.length + 1}`,
      startDate: today.toISOString(),
      endDate: today.toISOString(),
      season: "low_season",
      isDiscount: false,
      isActive: true,
      villaIds: [],
      currencyId,
    } as unknown as Partial<PriceRule>);
  };

  const handleEditPriceRule = (e: React.MouseEvent, priceRuleId: string) => {
    e.preventDefault();

    const priceRule = priceRules.find((item) => item.id === priceRuleId);
    if (!priceRule) return;

    // Validate here rather than letting the API answer 422: the page has no
    // field-level error slots, so a rejected save used to look like nothing
    // happening at all.
    if (!priceRule.name.trim()) {
      toast.error("Nama rule tidak boleh kosong.");
      return;
    }

    if (!priceRule.startDate || !priceRule.endDate) {
      toast.error("Tanggal mulai dan selesai harus diisi.");
      return;
    }

    if (priceRule.endDate < priceRule.startDate) {
      toast.error("Tanggal selesai tidak boleh sebelum tanggal mulai.");
      return;
    }

    const discount = Number(priceRule.discount);

    if (priceRule.isDiscount && (!discount || discount < 1 || discount > 100)) {
      toast.error("Diskon harus antara 1 dan 100 persen.");
      return;
    }

    if (!currencyId) {
      toast.error("Pilih mata uang dulu di bagian atas dashboard.");
      return;
    }

    // Build the payload explicitly instead of spreading the loaded rule.
    //
    // The API echoes a HAL `link` field on every response, and it validates
    // requests with `forbidNonWhitelisted`, so spreading the object back sent
    // `link` and was rejected with "property link should not exist" — a 422
    // the page had no way to show. A whitelist also survives the API growing
    // new response fields later.
    updatePriceRule({
      id: priceRule.id,
      updatedItem: {
        name: priceRule.name.trim(),
        season: priceRule.season,
        startDate: priceRule.startDate.toISOString(),
        endDate: priceRule.endDate.toISOString(),
        isDiscount: priceRule.isDiscount,
        isActive: priceRule.isActive,
        // With a discount: send the amount (the API infers `discountType` from
        // it, and rejects 0 as out of range). Without one: send an explicit
        // null, otherwise switching the discount off leaves the old percentage
        // stored and still being applied.
        discount: priceRule.isDiscount ? discount : null,
        villaIds: (priceRule.villas ?? []).map((item) => item.id),
        currencyId,
      } as unknown as Partial<PriceRule>,
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
        villas: priceRule.villas ?? [],
        villaIds: (priceRule.villas ?? []).map((item) => item.id),
        discount: priceRule.discount?.toString() ?? "",
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
        <div className="flex items-center justify-center min-h-300 bg-light">
          <div className="loader size-16 after:size-16"></div>
        </div>
      ) : (
        <>
          {priceRules.length === 0 ? (
            <div className="flex items-center justify-center min-h-300">
              <p className="text-center text-dark/50">No price rules added yet. Click "Add New Rules" to create one.</p>
            </div>
          ) : (
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
          )}
        </>
      )}
    </Layout>
  );
};
