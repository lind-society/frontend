import * as React from "react";
import { useGetApi, usePersistentData } from "../../../hooks";

import { CategoryModal } from "./category-modal";
import { FeatureItem } from "./feature-item";
import { FeatureHeader } from "./feature-header";

import { Button } from "../../../components";

import { FaPlus } from "react-icons/fa";

import { baseCurrency, Feature, ItemFeature, mainFeatures, optionalFeatures } from "../../../static";
import { Currency, Data, Features, OptionType, Payload } from "../../../types";
import { FeaturesPersistedType } from "./types";

interface ServiceFeatures {
  persistedDataKey: string;
  onChange?: (hasChanges: boolean) => void;
}

export const AddServiceFeatures: React.FC<ServiceFeatures> = ({ persistedDataKey, onChange }) => {
  // Store data to session storage
  const useStore = usePersistentData<FeaturesPersistedType>(persistedDataKey);
  const { data, setData, clearData } = useStore();

  const defaultFeature: Feature[] = Object.values(
    data.features?.reduce((acc, feature) => {
      const key = feature.type;
      if (!acc[key]) acc[key] = { id: crypto.randomUUID(), name: feature.type, icon: feature.icon, isEditing: false, items: [] };
      acc[key].items.push({
        id: crypto.randomUUID(),
        title: feature.name,
        free: feature.free,
        price: String(feature.price),
        currency: { label: feature.currency.code, value: feature.currency.id },
        hidden: false,
      });
      return acc;
    }, {} as Record<string, Feature>) || {}
  );

  const [features, setFeatures] = React.useState<Feature[]>(defaultFeature.length > 0 ? defaultFeature : mainFeatures);
  const [modalFeature, setModalFeature] = React.useState<boolean>(false);
  const [idIcon, setIdIcon] = React.useState<string>();

  const { data: currencies } = useGetApi<Payload<Data<Currency[]>>>({ key: ["currencies"], url: "currencies" });

  const otherFeatures = [...mainFeatures, ...optionalFeatures].filter((feature) => !features.some((item) => item.name === feature.name));

  React.useEffect(() => {
    if (!onChange) return;

    const hasValidFeature = features.some((feature) => feature.items.some((item) => item.title.trim() !== "" && item.currency !== null && item.price.trim() !== ""));

    if (hasValidFeature) {
      const dataToSave = {
        features: features.flatMap((feature) =>
          feature.items
            .filter((item) => item.title !== "")
            .map((item) => ({
              name: item.title,
              icon: feature.icon,
              type: feature.name,
              free: item.free,
              price: item.free ? 0 : +item.price,
              discountType: "percentage",
              discount: null,
              currencyId: item.currency?.value || baseCurrency,
              currency: { code: item.currency?.label, id: item.currency?.value },
            }))
        ) as Features[],
      };

      setData(dataToSave);
      onChange(false);
    } else {
      const dataToDelete = { features: [] };
      clearData(dataToDelete);
      onChange(true);
    }
  }, [features]);

  const updateFeatureIcon = (key: string | null, e: React.MouseEvent) => {
    const url = (e.target as HTMLImageElement).src;
    setFeatures((prevFeatures) => prevFeatures.map((feature) => (feature.id === idIcon ? { ...feature, icon: { url, key: key ?? "" } } : feature)));
  };

  const handleFeatureNameUpdate = (featureId: string, name: string) => {
    setFeatures((prevFeatures) => prevFeatures.map((feature) => (feature.id === featureId ? { ...feature, name } : feature)));
  };

  const handleFeatureEdit = (featureId: string, action: "toggle" | "finish") => {
    setFeatures((prevFeatures) =>
      prevFeatures.map((feature) =>
        feature.id === featureId ? (action === "toggle" ? { ...feature, isEditing: !feature.isEditing } : feature.name !== "" ? { ...feature, isEditing: false } : feature) : feature
      )
    );
  };

  const addFeature = () => {
    setFeatures((prevFeatures) => [
      {
        id: crypto.randomUUID(),
        name: "New Category",
        icon: { url: "", key: "" },
        items: [{ id: crypto.randomUUID(), title: "", free: false, price: "", currency: null, hidden: false }],
        isEditing: false,
      },
      ...prevFeatures,
    ]);
    setModalFeature(false);
  };

  const addOtherFeature = (name: string, icon: Feature["icon"]) => {
    setFeatures((prevFeatures) => [
      {
        id: crypto.randomUUID(),
        name,
        icon,
        items: [{ id: crypto.randomUUID(), title: "", free: false, price: "", currency: null, hidden: false }],
        isEditing: false,
      },
      ...prevFeatures,
    ]);
    setModalFeature(false);
  };

  const resetFeature = (featureId: string) => {
    if (!window.confirm("Are you sure you want to reset?")) return;

    const mergedFeatures = [...mainFeatures, ...optionalFeatures];
    const findDefaultFeatureValue = mergedFeatures.find((mergedFeature) => mergedFeature.id === featureId);

    setFeatures((prevFeatures) =>
      prevFeatures.map((feature) =>
        feature.id === featureId
          ? {
              id: feature.id,
              name: findDefaultFeatureValue?.name || "New Category",
              icon: { url: findDefaultFeatureValue?.icon.url || "", key: findDefaultFeatureValue?.icon.key || "" },
              items: [{ id: crypto.randomUUID(), title: "", free: false, price: "", currency: null, hidden: false }],
              isEditing: false,
            }
          : feature
      )
    );
  };

  const deleteFeature = (featureId: string) => {
    if (!window.confirm(`Are you sure you want to delete this category?`)) return;
    setFeatures((prevFeatures) => prevFeatures.filter((feature) => feature.id !== featureId));
  };

  const addItem = (featureId: string) => {
    setFeatures((prevFeatures) =>
      prevFeatures.map((feature) =>
        feature.id === featureId
          ? {
              ...feature,
              items: [...feature.items, { id: crypto.randomUUID(), title: "", free: false, price: "", hidden: false, currency: null }],
            }
          : feature
      )
    );
  };

  const deleteItem = (featureId: string, itemId: string) => {
    if (features.find((feature) => feature.id === featureId)?.items.length! <= 1) return;
    if (!window.confirm("Are you sure you want to delete item?")) return;

    setFeatures((prevFeatures) => prevFeatures.map((feature) => (feature.id === featureId ? { ...feature, items: feature.items.filter((item) => item.id !== itemId) } : feature)));
  };

  const resetItem = (featureId: string, itemId: string) => {
    if (!window.confirm("Are you sure you want to reset item?")) return;

    setFeatures((prevFeatures) =>
      prevFeatures.map((feature) =>
        feature.id === featureId
          ? {
              ...feature,
              items: feature.items.map((item) => (item.id === itemId ? { id: item.id, title: "", free: false, price: "", icon: { url: "", value: "" }, currency: null, hidden: false } : item)),
            }
          : feature
      )
    );
  };

  const updateItems = (featureId: string, itemId: string, key: keyof ItemFeature, value: string | boolean | OptionType | null) => {
    setFeatures((prevFeatures) =>
      prevFeatures.map((feature) =>
        feature.id === featureId
          ? {
              ...feature,
              items: feature.items.map((item) => (item.id === itemId ? { ...item, [key]: value } : item)),
            }
          : feature
      )
    );
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="heading">Service & Features</h2>
        <Button onClick={() => setModalFeature(true)} className="flex items-center justify-center gap-2 btn-primary">
          <FaPlus /> Add New Category
        </Button>
      </div>

      {features.map((feature) => (
        <div key={feature.id} className="px-4 py-8 border-b border-dark/30">
          <FeatureHeader
            feature={feature}
            onEdit={handleFeatureNameUpdate}
            onBlur={handleFeatureEdit}
            onAddItem={addItem}
            onReset={resetFeature}
            onDelete={deleteFeature}
            onIconChange={updateFeatureIcon}
            setIdIcon={setIdIcon}
          />

          <div className="space-y-4">
            {feature.items.map((item) => (
              <FeatureItem key={item.id} feature={feature} item={item} currencies={currencies} onUpdateItem={updateItems} onResetItem={resetItem} onDeleteItem={deleteItem} />
            ))}
          </div>
        </div>
      ))}

      <CategoryModal isVisible={modalFeature} onClose={() => setModalFeature(false)} otherFeatures={otherFeatures} onAddOtherFeature={addOtherFeature} onAddNewCategory={addFeature} />
    </>
  );
};
