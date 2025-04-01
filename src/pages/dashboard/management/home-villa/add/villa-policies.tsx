import * as React from "react";

import { usePersistentData } from "../../../../../hooks";

import { Button, SectionPolicy, ToastMessage } from "../../../../../components";

import { Villa } from "../../../../../types";

interface Policies {
  id: string;
  title: string;
  value: string;
  icon: { key: string; url: string };
}

const houseRulesLists = ["Add check in rules", "Add check out rules", "Add late check out rules"];
const paymentTermsLists = ["Terms 1", "Terms 2", "Terms 3"];

export const VillaPolicies = () => {
  // store data to session storage
  const useStore = usePersistentData<Partial<Villa>>("add-villa");
  const { setData, data } = useStore();

  const defaultHouseRules =
    data.policies?.filter((policy) => policy.type === "house rules").map((policy) => ({ id: crypto.randomUUID(), icon: policy.icon, title: policy.name, value: policy.description })) || [];
  const defaultPaymentTerms =
    data.policies?.filter((policy) => policy.type === "payment terms").map((policy) => ({ id: crypto.randomUUID(), icon: policy.icon, title: policy.name, value: policy.description })) || [];

  const [houseRules, setHouseRules] = React.useState<Policies[]>(defaultHouseRules);
  const [paymentTerms, setPaymentTerms] = React.useState<Policies[]>(defaultPaymentTerms);

  const updatePolicies = (policies: Policies[], type: string) => {
    if (type === "House Rules") {
      setHouseRules(policies);
    } else if (type === "Payment Terms") {
      setPaymentTerms(policies);
    }
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    const formattedData = {
      policies: [
        ...houseRules.map((rule) => ({
          name: rule.title,
          type: "house rules",
          description: rule.value,
          icon: { key: "mdi:office-building", url: "https://api.iconify.design/mdi/office-building.svg" },
        })),
        ...paymentTerms.map((term) => ({
          name: term.title,
          type: "payment terms",
          description: term.value,
          icon: { key: "mdi:office-building", url: "https://api.iconify.design/mdi/office-building.svg" },
        })),
      ] as Villa["policies"],
    };
    setData(formattedData);
    ToastMessage({ message: "Success saving villa policies", color: "#22c55e" });
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div className="p-8 border rounded-b bg-light border-dark/30">
      <SectionPolicy title="House Rules" categories={houseRulesLists} defaultPolicies={houseRules} onUpdate={updatePolicies} />
      <SectionPolicy title="Payment Terms" categories={paymentTermsLists} defaultPolicies={paymentTerms} onUpdate={updatePolicies} />

      {/* Save and Cancel Buttons */}
      <div className="flex justify-end gap-4">
        {/* <Button className="btn-outline">Reset</Button> */}
        <Button onClick={handleSubmit} className="btn-primary">
          Save
        </Button>
      </div>
    </div>
  );
};
