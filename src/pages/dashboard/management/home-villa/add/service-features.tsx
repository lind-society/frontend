import * as React from "react";

import { useGetApi, usePersistentData } from "../../../../../hooks";

import IconifyPicker from "@zunicornshift/mui-iconify-picker";

import Select from "react-select";

import { Button, Modal, ToastMessage } from "../../../../../components";

import { FaPenAlt, FaPlus } from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";
import { FaTrashAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

import { baseCurrency, Feature, ItemFeature, mainFeatures, otherFeatures } from "../../../../../static";

import { Currency, Data, OptionType, Payload, Villa } from "../../../../../types";

export const ServiceFeatures = () => {
  // store data to session storage
  const useStore = usePersistentData<Partial<Villa>>("add-villa");
  const { data, setData } = useStore();

  const defaultFeature: Feature[] = Object.values(
    data.features?.reduce((acc, feature) => {
      const key = feature.type; // Group by type
      if (!acc[key]) acc[key] = { id: crypto.randomUUID(), name: feature.type, icon: feature.icon, isEditing: false, items: [] };
      acc[key].items.push({
        id: crypto.randomUUID(),
        title: feature.name,
        free: feature.free,
        price: String(feature.price),
        currency: { label: feature.currency?.code, value: feature.currency?.id },
        hidden: false,
      });
      return acc;
    }, {} as Record<string, Feature>) || {}
  );

  const [features, setFeatures] = React.useState<Feature[]>(defaultFeature.length > 0 ? defaultFeature : mainFeatures);
  const [modalFeature, setModalFeature] = React.useState<boolean>(false);
  const [idIcon, setIdIcon] = React.useState<string>();

  const { data: currencies } = useGetApi<Payload<Data<Currency[]>>>({ key: ["currencies"], url: `currencies` });

  // useEffect(() => {
  //   localStorage.setItem("categories", JSON.stringify(categories));
  // }, [categories]);

  const updateFeatureIcon = (key: string | null, e: React.MouseEvent<HTMLElement>) => {
    const url = (e.target as HTMLImageElement).src; // Extract src as string
    setFeatures((prevFeatures) => prevFeatures.map((feature) => (feature.id === idIcon ? { ...feature, icon: { url, key: key ?? "" } } : feature)));
  };

  const updateFeatureName = (featureId: string, name: string) => {
    setFeatures((prevFeatures) => prevFeatures.map((feature) => (feature.id === featureId ? { ...feature, name } : feature)));
  };

  const toggleEditFeatureName = (featureId: string) => {
    setFeatures((prevFeatures) => prevFeatures.map((feature) => (feature.id === featureId ? { ...feature, isEditing: !feature.isEditing } : feature)));
  };

  const finishEditingFeatureName = (featureId: string) => {
    setFeatures((prevFeatures) => prevFeatures.map((feature) => (feature.id === featureId && feature.name !== "" ? { ...feature, isEditing: false } : feature)));
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
    const mergedFeatures = [...mainFeatures, ...otherFeatures];
    const findDefaultFeatureValue = mergedFeatures.find((mergedFeature) => mergedFeature.name === name);
    setFeatures((prevFeatures) => [
      {
        id: findDefaultFeatureValue?.id || "",
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
    const mergedFeatures = [...mainFeatures, ...otherFeatures];
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
        feature.id === featureId ? { ...feature, items: [...feature.items, { id: crypto.randomUUID(), title: "", free: false, price: "", hidden: false, currency: null }] } : feature
      )
    );
  };

  // const toggleItemHidden = (catIndex: number, itemIndex: number) => {
  //   const newCategories = [...categories];
  //   newCategories[catIndex].items[itemIndex].hidden = !newCategories[catIndex].items[itemIndex].hidden;
  //   setFeatures(newCategories);
  // };

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

  const updateItems = (featureId: string, itemId: string, key: keyof ItemFeature, value: string | boolean | OptionType) => {
    setFeatures((prevFeatures) =>
      prevFeatures.map((feature) => (feature.id === featureId ? { ...feature, items: feature.items.map((item) => (item.id === itemId ? { ...item, id: item.id, [key]: value } : item)) } : feature))
    );
  };

  const handleSubmitService = (e: React.MouseEvent) => {
    e.preventDefault();

    const formattedData = {
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
      ) as Villa["features"],
    };

    setData(formattedData);
    ToastMessage({ message: "Success saving service features", color: "#22c55e" });
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <>
      <div className="p-8 space-y-8 border rounded-b bg-light border-dark/30">
        <div className="flex items-center justify-between">
          <h2 className="heading">Service & Features</h2>
          <Button onClick={() => setModalFeature(true)} className="flex items-center justify-center gap-2 btn-primary">
            <FaPlus /> Add New Category
          </Button>
        </div>
        {features.map((feature) => (
          <div key={feature.id} className="p-4 mt-4 border-b border-dark/30">
            <div className="flex items-center justify-between min-h-10">
              {feature.isEditing ? (
                <div className="flex items-center gap-4 max-w-80">
                  <input
                    type="text"
                    value={feature.name}
                    onChange={(e) => updateFeatureName(feature.id, e.target.value)}
                    onBlur={() => finishEditingFeatureName(feature.id)}
                    className="input-text"
                    autoFocus
                  />
                  {feature.name === "" && <small className="text-red-600 whitespace-nowrap">title must be filled</small>}
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4">
                  <div onClick={() => setIdIcon(feature.id)}>
                    <IconifyPicker onChange={updateFeatureIcon} value={feature.icon.key} />
                  </div>
                  <span className="font-semibold">{feature.name}</span>
                  <button onClick={() => toggleEditFeatureName(feature.id)}>
                    <FaPenAlt />
                  </button>
                </div>
              )}
              <div className="flex gap-4">
                <Button className="flex items-center gap-1 btn-primary" onClick={() => addItem(feature.id)}>
                  <FaPlus size={12} /> Add Item
                </Button>
                <Button className="flex items-center gap-1 btn-blue" onClick={() => resetFeature(feature.id)}>
                  <GrPowerReset color="plain" /> Reset
                </Button>
                <Button className="flex items-center gap-1 btn-red" onClick={() => deleteFeature(feature.id)}>
                  <FaTrashAlt /> Delete
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              {feature.items.map((item) => (
                <div key={item.id} className="flex w-full gap-8 p-2 mt-2">
                  <div className="w-full space-y-1">
                    <label className="block text-sm">Title *</label>
                    <input type="text" placeholder="Title" value={item.title} onChange={(e) => updateItems(feature.id, item.id, "title", e.target.value)} className="input-text" required />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm">Free *</label>
                    <div className="flex items-center gap-8 pt-1.5">
                      <label className="flex items-center gap-2">
                        Yes <input type="checkbox" className="accent-primary size-4" checked={item.free} onChange={() => updateItems(feature.id, item.id, "free", true)} />
                      </label>
                      <label className="flex items-center gap-2">
                        No <input type="checkbox" className="accent-primary size-4" checked={!item.free} onChange={() => updateItems(feature.id, item.id, "free", false)} />
                      </label>
                    </div>
                  </div>
                  <div className="w-full space-y-1">
                    <label className="block text-sm">Price *</label>
                    <div className="flex items-center w-full gap-2">
                      <Select
                        className="w-full text-sm"
                        options={currencies?.data.data.map((currency) => ({ value: currency.id, label: currency.code }))}
                        value={item.currency}
                        onChange={(option) => updateItems(feature.id, item.id, "currency", option as OptionType)}
                        placeholder="Select Currency"
                        isDisabled={item.free}
                        required
                      />
                      <input
                        type="number"
                        className="input-text"
                        placeholder={item.currency?.label ? `Enter currency in ${item.currency?.label}` : "Select currency first"}
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                          if (["e", "E", "+", "-"].includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        value={item.price}
                        onChange={(e) => updateItems(feature.id, item.id, "price", e.target.value)}
                        disabled={item.free || !item.currency}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm opacity-0">Action</label>
                    <div className="flex items-center gap-8 pt-1.5">
                      {/* <button onClick={() => toggleItemHidden(feature.id, item.id)}>{item.hidden ? <FaEye size={24} /> : <FaEyeSlash size={24} />}</button> */}
                      <button onClick={() => resetItem(feature.id, item.id)}>
                        <GrPowerReset size={22} />
                      </button>
                      <button onClick={() => deleteItem(feature.id, item.id)}>
                        <IoClose size={28} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {/* Save and Cancel Buttons */}
        <div className="flex justify-end gap-4">
          {/* <Button className="btn-outline">Reset</Button> */}
          <Button className="btn-primary" onClick={handleSubmitService}>
            Save
          </Button>
        </div>
      </div>
      <Modal isVisible={modalFeature} onClose={() => setModalFeature(false)}>
        <h2 className="text-lg font-bold">Add New Category</h2>
        <div className="mt-4 border border-dark/30">
          {[...mainFeatures, ...otherFeatures]
            .filter((feature) => !features.some((item) => item.name === feature.name))
            .map((feature, index) => (
              <div key={index} className="flex items-center justify-between p-2 border-b border-dark/30">
                <span>{feature.name}</span>
                <Button onClick={() => addOtherFeature(feature.name, feature.icon)} className="btn-outline">
                  <FaPlus />
                </Button>
              </div>
            ))}
        </div>
        <div className="flex items-center w-full my-6">
          <div className="flex-grow h-px bg-dark/30"></div>
          <span className="flex-shrink-0 px-3 text-sm text-dark">or</span>
          <div className="flex-grow h-px bg-dark/30"></div>
        </div>
        <Button onClick={addFeature} className="flex items-center justify-center w-full gap-2 btn-primary">
          <FaPlus /> Add new category
        </Button>
      </Modal>
    </>
  );
};
