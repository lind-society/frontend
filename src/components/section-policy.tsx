import * as React from "react";
import { Button } from "./button";
import { FaPlus } from "react-icons/fa";
import { Modal } from "./modal";

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

export const SectionPolicy = ({ title, categories, onUpdate, defaultPolicies }: SectionPoliciesProps) => {
  const [policies, setPolicies] = React.useState<Policies[]>(defaultPolicies);
  const [modalPolicies, setModalPolicies] = React.useState<boolean>(false);

  const addPolicies = (title: string) => {
    setPolicies((prevPolicies) => [...prevPolicies, { id: crypto.randomUUID(), title, icon: { key: "mdi:office-building", url: "https://api.iconify.design/mdi/office-building.svg" }, value: "" }]);
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
                  <FaPlus />
                </Button>
              </div>
            ))}
        </div>
      </Modal>
    </>
  );
};
