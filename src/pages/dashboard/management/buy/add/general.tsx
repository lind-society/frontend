import * as React from "react";

import { useGetApi, useGetApiWithAuth, usePersistentData } from "../../../../../hooks";

import Select from "react-select";

import { NumberInput } from "../../../../../components";

import { Currency, Data, OptionType, Owner, Payload, Property } from "../../../../../types";

interface FormState {
  name: string;
  secondaryName: string;
  highlight: string;
  price: string;
  discount: string;
  ownershipType: string;
  soldStatus: boolean;
  currency: OptionType | null;
  owner: OptionType | null;
}

const FormField = ({ label, children, required = false }: { label: string; children: React.ReactNode; required?: boolean }) => (
  <div className="flex items-center">
    <label className="block whitespace-nowrap min-w-60">
      {label} {required && "*"}
    </label>
    {children}
  </div>
);

export const General: React.FC<{ onChange?: (hasChanges: boolean) => void }> = ({ onChange }) => {
  // store data to session storage
  const useStore = usePersistentData<Partial<Property>>("add-property");
  const { setData, data } = useStore();

  const { data: currencies } = useGetApi<Payload<Data<Currency[]>>>({ key: ["currencies"], url: "currencies" });
  const { data: owners } = useGetApiWithAuth<Payload<Data<Owner[]>>>({ key: ["owners"], url: `owners` });

  const [formState, setFormState] = React.useState<FormState>({
    name: data.name || "",
    secondaryName: data.secondaryName || "",
    highlight: data.highlight || "",
    price: String(data.discount || ""),
    discount: String(data.discount || ""),
    soldStatus: data.soldStatus || false,
    ownershipType: data.ownershipType || "Leasehold",
    currency: null,
    owner: null,
  });

  const updateFormState = (field: keyof Property, value: string | boolean | OptionType | null) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handlePriceChange = (value: string) => {
    if (+value > 999999999999999 || +value < 0) return;
    updateFormState("price", value);
  };

  const handleDiscountChange = (value: string) => {
    if (+value > 100 || +value < 0) return;
    updateFormState("discount", value);
  };

  const calculateDiscountedPrice = () => {
    const basePrice = +formState.price || 0;
    const discountPercent = +formState.discount || 0;
    return basePrice - basePrice * (discountPercent / 100);
  };

  // Check if form is complete
  React.useEffect(() => {
    if (!onChange) return;

    const { name, secondaryName, highlight, currency, owner, discount, price } = formState;

    const requiredFields = [name, secondaryName, highlight, currency, owner];

    const hasAnyOnePriceAndDiscount = Object.values(price).some((p) => !!p) && Object.values(discount).some((d) => !!d);

    const isComplete = requiredFields.every((field) => !!field) && hasAnyOnePriceAndDiscount;

    if (isComplete) {
      const dataToSave = {
        name: formState.name,
        secondaryName: formState.secondaryName,
        highlight: formState.highlight,
        soldStatus: formState.soldStatus,
        ownershipType: formState.ownershipType,
        price: +formState.price,
        discount: +formState.discount,
        currencyId: formState.currency?.value || "",
        ownerId: formState.owner?.value || "",
      };

      onChange(false);
      setData(dataToSave);
    } else {
      onChange(true);
    }
  }, [formState]);

  React.useEffect(() => {
    if (currencies && owners) {
      const findCurrency = currencies.data.data.find((c) => c.id === data.currencyId);
      const findOwner = owners.data.data.find((o) => o.id === data.ownerId);

      if (findCurrency) {
        updateFormState("currency", { label: findCurrency.code, value: findCurrency.id });
      }
      if (findOwner) {
        updateFormState("owner", { label: findOwner.name, value: findOwner.id });
      }
    }
  }, [currencies, owners]);

  return (
    <>
      <h2 className="heading">General</h2>
      <form className="mt-6 space-y-8">
        <FormField label="Property name" required>
          <input type="text" className="input-text" placeholder="Urna Santal Villa" value={formState.name} onChange={(e) => updateFormState("name", e.target.value)} required />
        </FormField>

        <FormField label="Secondary property name" required>
          <input type="text" className="input-text" placeholder="Urna Cangau" value={formState.secondaryName} onChange={(e) => updateFormState("secondaryName", e.target.value)} required />
        </FormField>

        <FormField label="Owner" required>
          <Select
            className="w-full text-sm"
            options={owners?.data.data.map((owner) => ({ value: owner.id, label: owner.name }))}
            value={formState.owner}
            onChange={(option) => updateFormState("owner", option)}
            placeholder="Select Owner"
            required
          />
        </FormField>

        <FormField label="Currency" required>
          <Select
            className="w-full text-sm"
            options={currencies?.data.data.map((currency) => ({ value: currency.id, label: currency.code }))}
            value={formState.currency}
            onChange={(option) => updateFormState("currency", option)}
            placeholder="Select Currency"
            required
          />
        </FormField>

        <FormField label="Price" required>
          <div className="flex items-center w-full gap-4">
            <NumberInput className="input-text" value={formState.price} onChange={(e) => handlePriceChange(e.target.value)} placeholder={`Enter price in ${formState.currency?.label}`} required />

            <label className="block whitespace-nowrap">Discount</label>

            <NumberInput className="input-text" value={formState.discount} onChange={(e) => handleDiscountChange(e.target.value)} placeholder="e.g. 0%" />

            <label className="block whitespace-nowrap">Discounted Price</label>

            <input type="number" className="input-text" value={calculateDiscountedPrice()} readOnly />
          </div>
        </FormField>

        <FormField label="Ownership" required>
          {(["Freehold", "Leasehold"] as const).map((ownership, index) => (
            <div key={index} className="flex items-center gap-2 ms-4">
              <label className="cursor-pointer" htmlFor={ownership}>
                {ownership}
              </label>
              <input
                type="checkbox"
                id={ownership}
                className="cursor-pointer accent-primary"
                checked={formState.ownershipType.includes(ownership)}
                onChange={() => updateFormState("ownershipType", ownership)}
              />
            </div>
          ))}
        </FormField>

        <FormField label="Sold Status" required>
          {(["Yes", "No"] as const).map((status, index) => (
            <div key={index} className="flex items-center gap-2 ms-4">
              <label className="cursor-pointer" htmlFor={status}>
                {status}
              </label>
              <input
                type="checkbox"
                id={status}
                className="cursor-pointer accent-primary"
                checked={formState.soldStatus === (status === "Yes")}
                onChange={() => updateFormState("soldStatus", status === "Yes")}
              />
            </div>
          ))}
        </FormField>

        <FormField label="Highlights" required>
          <textarea
            className="h-40 input-text"
            value={formState.highlight}
            onChange={(e) => updateFormState("highlight", e.target.value)}
            placeholder="The beautiful Uma Santai Villa is set in the background of the Kerobokan paddy fields swaying in the tropical wind."
            required
          />
        </FormField>
      </form>
    </>
  );
};
