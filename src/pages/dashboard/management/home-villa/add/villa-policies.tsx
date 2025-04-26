import * as React from "react";

import { usePersistentData } from "../../../../../hooks";

import { SectionPolicy } from "../../../../../components/ui";

import { baseCancellationTerms, baseHouseRules, basePaymentTerms } from "../../../../../static";

import { Villa } from "../../../../../types";

interface Policies {
  id: string;
  title: string;
  value: string;
  icon: { key: string; url: string };
}

const houseRulesLists = ["Add check in rules", "Add check out rules", "Add late check out rules"];
const paymentTermsLists = ["Terms 1", "Terms 2", "Terms 3"];
const cancellationTermsLists = ["Terms 1", "Terms 2", "Terms 3", "Terms 4", "Terms 5", "Terms 6"];

export const VillaPoliciesTab: React.FC<{ onChange?: (hasChanges: boolean) => void }> = ({ onChange }) => {
  // store data to session storage
  const useStore = usePersistentData<Partial<Villa>>("add-villa");
  const { setData, data } = useStore();

  const defaultHouseRules =
    data.policies?.filter((policy) => policy.typeId === baseHouseRules).map((policy) => ({ id: crypto.randomUUID(), icon: policy.icon, title: policy.name, value: policy.description })) ||
    houseRulesLists.map((title) => ({ id: crypto.randomUUID(), icon: { key: "key", url: "url" }, title, value: "" }));

  const defaultPaymentTerms =
    data.policies?.filter((policy) => policy.typeId === basePaymentTerms).map((policy) => ({ id: crypto.randomUUID(), icon: policy.icon, title: policy.name, value: policy.description })) || [];
  const defaultCancellationTerms =
    data.policies?.filter((policy) => policy.typeId === baseCancellationTerms).map((policy) => ({ id: crypto.randomUUID(), icon: policy.icon, title: policy.name, value: policy.description })) || [];

  const [houseRules, setHouseRules] = React.useState<Policies[]>(defaultHouseRules);
  const [paymentTerms, setPaymentTerms] = React.useState<Policies[]>(defaultPaymentTerms);
  const [cancellationTerms, setCancellationTerms] = React.useState<Policies[]>(defaultCancellationTerms);

  const updatePolicies = (policies: Policies[], type: string) => {
    if (type === "Payment Terms") {
      setPaymentTerms(policies);
    } else if (type === "Cancellation Terms") {
      setCancellationTerms(policies);
    } else if (type === "House Rules") {
      setHouseRules(policies);
    }
  };

  const updateHouseRuleValue = (id: string, value: string) => {
    const updatedRules = houseRules.map((rule) => (rule.id === id ? { ...rule, value } : rule));
    setHouseRules(updatedRules);
  };

  React.useEffect(() => {
    if (!onChange) return;

    const filledHouseRules = houseRules.filter((rule) => rule.value.trim() !== "");
    const isHouseRulesComplete = filledHouseRules.length === 3;

    if (isHouseRulesComplete) {
      const dataToSave = {
        policies: [
          ...houseRules.map((rule) => ({
            name: rule.title.replace("Add ", ""),
            typeId: baseHouseRules,
            description: rule.value,
            icon: { key: "key", url: "url" },
          })),
          ...cancellationTerms.map((rule) => ({
            name: rule.title,
            typeId: baseCancellationTerms,
            description: rule.value,
            icon: { key: "key", url: "url" },
          })),
          ...paymentTerms.map((term) => ({
            name: term.title,
            typeId: basePaymentTerms,
            description: term.value,
            icon: { key: "key", url: "url" },
          })),
        ] as Villa["policies"],
      };
      setData(dataToSave);
      onChange(false);
    } else {
      onChange(true);
    }
  }, [houseRules, cancellationTerms, paymentTerms]);

  return (
    <>
      <div className="mb-8 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="heading">House Rules</h2>
        </div>

        <div className="space-y-8">
          {houseRules.map((rule) => (
            <div key={rule.id} className="flex items-center">
              <label className="block whitespace-nowrap min-w-60">Add {rule.title} *</label>
              <input
                type="text"
                placeholder={`Enter description for ${rule.title}`}
                value={rule.value}
                onChange={(e) => updateHouseRuleValue(rule.id, e.target.value)}
                className="input-text"
                required
              />
            </div>
          ))}
        </div>
      </div>

      <SectionPolicy title="Payment Terms" categories={paymentTermsLists} defaultPolicies={paymentTerms} onUpdate={updatePolicies} />

      <SectionPolicy title="Cancellation Terms" categories={cancellationTermsLists} defaultPolicies={cancellationTerms} onUpdate={updatePolicies} />
    </>
  );
};
