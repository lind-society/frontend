import * as React from "react";
import { usePersistentData } from "../../../../../hooks";

import { Button, Modal } from "../../../../../components";

import { FaPlus } from "react-icons/fa";

import { Villa } from "../../../../../types";

interface Policies {
  id: string;
  title: string;
  value: string;
  icon: { key: string; url: string };
}

interface SectionPoliciesProps {
  defaultPolicies: Policies[];
  title: string;
  categories: string[];
  onUpdate: (policies: Policies[], type: string) => void;
}

const houseRulesLists = ["Add check in rules", "Add check out rules", "Add late check out rules"];
const paymentTermsLists = ["Terms 1", "Terms 2", "Terms 3"];

const SectionPolicies = ({ title, categories, onUpdate, defaultPolicies }: SectionPoliciesProps) => {
  const [policies, setPolicies] = React.useState<Policies[]>(defaultPolicies);
  const [modalPolicies, setModalPolicies] = React.useState<boolean>(false);

  const addPolicies = (title: string) => {
    setPolicies((prevPolicies) => [...prevPolicies, { id: crypto.randomUUID(), title, icon: { key: "mdi:office-building", url: "https://api.iconify.design/mdi/office-building.svg" }, value: "" }]);
    setModalPolicies(false);
  };

  const updatePoliciesValue = (id: string, value: string) => {
    const updatedPolicies = policies.map((f) => (f.id === id ? { ...f, value } : f));
    setPolicies(updatedPolicies);
    onUpdate(updatedPolicies, title);
  };

  const resetPoliciesValue = (id: string) => {
    updatePoliciesValue(id, "");
  };

  const removePolicies = (id: string) => {
    const updatedPolicies = policies.filter((f) => f.id !== id);
    setPolicies(updatedPolicies);
    onUpdate(updatedPolicies, title);
  };

  return (
    <>
      <div className="mb-8 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="heading">{title}</h2>
          <Button onClick={() => setModalPolicies(true)} className="flex items-center gap-2 btn-primary">
            <FaPlus /> Add {title}
          </Button>
        </div>

        <div className="space-y-8">
          {policies.map((feature) => (
            <div key={feature.id} className="space-y-2">
              <div className="flex items-center">
                <label className="block whitespace-nowrap min-w-60">{feature.title} *</label>
                <input type="text" placeholder={`Enter ${feature.title}`} value={feature.value} onChange={(e) => updatePoliciesValue(feature.id, e.target.value)} className="input-text" required />
              </div>
              <div className="flex gap-4">
                <Button onClick={() => resetPoliciesValue(feature.id)} className="w-full btn-outline">
                  Reset
                </Button>
                <Button onClick={() => removePolicies(feature.id)} className="w-full btn-red">
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal isVisible={modalPolicies} onClose={() => setModalPolicies(false)}>
        <h2 className="text-lg font-bold">Add Villa Policies</h2>
        <div className="mt-4 space-y-2">
          {categories
            .filter((category) => !policies.some((f) => f.title === category))
            .map((category, index) => (
              <div key={index} className="flex items-center justify-between p-2 border-b">
                <span>{category}</span>
                <Button onClick={() => addPolicies(category)} className="btn-outline">
                  +
                </Button>
              </div>
            ))}
        </div>
      </Modal>
    </>
  );
};

export const VillaPolicies = () => {
  const useStore = usePersistentData<Partial<Villa>>("add-villa");
  const { setData, data } = useStore();

  const [houseRules, setHouseRules] = React.useState<Policies[]>(
    data.policies?.filter((policy) => policy.type === "house rules").map((policy) => ({ id: crypto.randomUUID(), icon: policy.icon, title: policy.name, value: policy.description })) || []
  );

  const [paymentTerms, setPaymentTerms] = React.useState<Policies[]>(
    data.policies?.filter((policy) => policy.type === "payment terms").map((policy) => ({ id: crypto.randomUUID(), icon: policy.icon, title: policy.name, value: policy.description })) || []
  );

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
  };

  return (
    <div className="p-8 border rounded-b bg-light border-dark/20">
      <SectionPolicies title="House Rules" categories={houseRulesLists} defaultPolicies={houseRules} onUpdate={updatePolicies} />
      <SectionPolicies title="Payment Terms" categories={paymentTermsLists} defaultPolicies={paymentTerms} onUpdate={updatePolicies} />

      {/* Save and Cancel Buttons */}
      <div className="flex justify-end gap-4">
        <Button className="btn-outline">Reset</Button>
        <Button onClick={handleSubmit} className="btn-primary">
          Save
        </Button>
      </div>
    </div>
  );
};
