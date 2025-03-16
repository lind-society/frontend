import * as React from "react";
import { Button, Modal } from "../../../../../components";

interface Feature {
  id: number;
  title: string;
  type: "text" | "radio";
  value: string;
  required: boolean;
}

export const ServiceFeatures = () => {
  const [features, setFeatures] = React.useState<Feature[]>([]);
  const [title, setTitle] = React.useState("");
  const [modalFeatures, setModalFeatures] = React.useState<boolean>(false);
  const [type, setType] = React.useState<"text" | "radio">("text");
  const [required, setRequired] = React.useState<boolean>(false);

  const addFeature = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setFeatures([...features, { id: Date.now(), title, type, required, value: type === "text" ? "" : "Yes" }]);
    setTitle("");
    setRequired(false);
    setModalFeatures(false);
  };

  const updateFeatureValue = (id: number, value: string) => {
    setFeatures(features.map((f) => (f.id === id ? { ...f, value } : f)));
  };

  const resetFeatureValue = (id: number) => {
    setFeatures(features.map((f) => (f.id === id ? { ...f, value: f.type === "text" ? "" : "Yes" } : f)));
  };

  const removeFeature = (id: number) => {
    setFeatures(features.filter((f) => f.id !== id));
  };

  return (
    <div className="p-8 border rounded-b bg-light border-dark/20">
      <div className="flex items-center justify-between">
        <h2 className="heading">Key Features</h2>
        <Button onClick={() => setModalFeatures(true)} className="btn-primary">
          + Add Key Features
        </Button>
      </div>

      <div className="mt-4 space-y-4">
        {features.map((feature) => (
          <div key={feature.id} className="space-y-2">
            <div className="flex items-center">
              <label className="block whitespace-nowrap min-w-60">
                {feature.title} {feature.required ? "*" : ""}
              </label>
              {feature.type === "text" ? (
                <input
                  type="text"
                  placeholder={`input the ${feature.title} size/item`}
                  value={feature.value}
                  onChange={(e) => updateFeatureValue(feature.id, e.target.value)}
                  className="input-text"
                  required={feature.required}
                />
              ) : (
                <div className="flex gap-4 mt-2">
                  <label>
                    <input type="radio" value="Yes" checked={feature.value === "Yes"} onChange={() => updateFeatureValue(feature.id, "Yes")} />
                    Yes
                  </label>
                  <label>
                    <input type="radio" value="No" checked={feature.value === "No"} onChange={() => updateFeatureValue(feature.id, "No")} />
                    No
                  </label>
                </div>
              )}
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
        <div className="flex w-full gap-4 py-4">
          <input type="text" placeholder="Feature Title" value={title} onChange={(e) => setTitle(e.target.value)} className="input-text" />
          <select value={type} onChange={(e) => setType(e.target.value as "text" | "radio")} className="input-select min-w-32">
            <option value="text">Text Input</option>
            <option value="radio">Radio Input</option>
          </select>
          <label className="flex items-center gap-1">
            <input type="checkbox" checked={required} onChange={(e) => setRequired(e.target.checked)} className="accent-primary" />
            Required
          </label>
          <Button onClick={addFeature} className="btn-primary whitespace-nowrap">
            + Add
          </Button>
        </div>
      </Modal>
    </div>
  );
};
