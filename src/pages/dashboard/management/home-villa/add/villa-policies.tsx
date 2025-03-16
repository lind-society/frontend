import * as React from "react";
import { Button, Modal } from "../../../../../components";

interface Feature {
  id: number;
  title: string;
  value: string;
  required: boolean;
}
const houseRulesLists = ["Add check in rules", "Add check out rules", "Add late check out rules"];

const paymentTermsLists = ["Terms 1", "Terms 2", "Terms 3"];

const SectionPolicies = ({ title, categories }: { title: string; categories: string[] }) => {
  const [features, setFeatures] = React.useState<Feature[]>([]);
  const [modalFeatures, setModalFeatures] = React.useState<boolean>(false);

  const addFeature = (title: string) => {
    setFeatures([...features, { id: Date.now(), title, required: false, value: "" }]);
  };

  const updateFeatureValue = (id: number, value: string) => {
    setFeatures(features.map((f) => (f.id === id ? { ...f, value } : f)));
  };

  const resetFeatureValue = (id: number) => {
    setFeatures(features.map((f) => (f.id === id ? { ...f, value: "" } : f)));
  };

  const removeFeature = (id: number) => {
    setFeatures(features.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="heading">{title}</h2>
        <Button onClick={() => setModalFeatures(true)} className="btn-primary">
          + Add {title}
        </Button>
      </div>

      <div className="space-y-4">
        {features.map((feature) => (
          <div key={feature.id} className="space-y-2">
            <div className="flex items-center">
              <label className="block whitespace-nowrap min-w-60">
                {feature.title} {feature.required ? "*" : ""}
              </label>
              <input
                type="text"
                placeholder={`Enter ${feature.title}`}
                value={feature.value}
                onChange={(e) => updateFeatureValue(feature.id, e.target.value)}
                className="input-text"
                required={feature.required}
              />
            </div>
            <div className="flex gap-4">
              <Button onClick={() => resetFeatureValue(feature.id)} className="w-full btn-outline">
                Reset
              </Button>
              <Button onClick={() => removeFeature(feature.id)} className="w-full btn-red">
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal isVisible={modalFeatures} onClose={() => setModalFeatures(false)}>
        <h2 className="text-lg font-bold">Add Villa Policies</h2>
        <div className="mt-4 space-y-2">
          {categories
            .filter((category) => !features.some((f) => f.title === category))
            .map((category, index) => (
              <div key={index} className="flex items-center justify-between p-2 border-b">
                <span>{category}</span>
                <Button onClick={() => addFeature(category)} className="btn-outline">
                  +
                </Button>
              </div>
            ))}
        </div>
      </Modal>
    </div>
  );
};

export const VillaPolicies = () => {
  return (
    <div className="p-8 space-y-8 border rounded-b bg-light border-dark/20">
      <SectionPolicies title="House Rules" categories={houseRulesLists} />
      <SectionPolicies title="Payment Terms" categories={paymentTermsLists} />
      {/* Save and Cancel Buttons */}
      <div className="flex justify-end gap-4">
        <Button className="btn-outline">Reset</Button>
        <Button className="btn-primary">Save</Button>
      </div>
    </div>
  );
};
