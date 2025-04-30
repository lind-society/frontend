import * as React from "react";

import { useGetApi, useGetApiWithAuth, usePersistentData } from "../../../../../hooks";

import Select from "react-select";

import { NumberInput } from "../../../../../components";

import { Activity, Currency, Data, OptionType, Owner, Payload } from "../../../../../types";

interface FormState {
  name: string;
  secondaryName: string;
  highlight: string;
  price: string;
  isDiscount: boolean;
  discount: string;
  duration: string;
  startDate: string;
  endDate: string;
  openingHour: string;
  closingHour: string;
  currency: OptionType | null;
  category: OptionType | null;
  owner: OptionType | null;
}

const FormField = ({ label, children, required = false }: { label: string; children: React.ReactNode; required?: boolean }) => (
  <div className="flex items-center">
    <span className="block whitespace-nowrap min-w-60">
      {label} {required && "*"}
    </span>
    {children}
  </div>
);

export const GeneralTab: React.FC<{ onChange?: (hasChanges: boolean) => void }> = ({ onChange }) => {
  // store data to session storage
  const useStore = usePersistentData<Partial<Activity>>("add-activity");
  const { setData, data } = useStore();

  const { data: currencies } = useGetApi<Payload<Data<Currency[]>>>({ key: ["currencies"], url: "currencies" });
  const { data: owners } = useGetApiWithAuth<Payload<Data<Owner[]>>>({ key: ["owners"], url: "/owners" });

  const [formState, setFormState] = React.useState<FormState>({
    name: data.name || "",
    secondaryName: data.secondaryName || "",
    highlight: data.highlight || "",
    price: String(data.price || ""),
    isDiscount: false,
    discount: String(data.discount || ""),
    duration: data.duration || "",
    startDate: data.startDate || "",
    endDate: data.endDate || "",
    openingHour: data.openingHour || "",
    closingHour: data.closingHour || "",
    currency: null,
    category: null,
    owner: null,
  });

  const updateFormState = (field: keyof FormState, value: string | boolean | OptionType | null) => {
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

  const calculatePrice = (price: string, discount: string) => {
    const result = +price - +price * (+discount / 100);
    return Number.isInteger(result) ? result.toString() : result.toFixed(2);
  };

  // Check if form is complete
  React.useEffect(() => {
    if (!onChange) return;

    const { name, secondaryName, highlight, currency, owner, discount, price, category, closingHour, duration, endDate, openingHour, startDate, isDiscount } = formState;

    const requiredFields = [name, secondaryName, highlight, currency, owner, category, closingHour, duration, endDate, openingHour, startDate, isDiscount];

    const isComplete = requiredFields.every((field) => !!field);

    if (isComplete) {
      const dataToSave = {
        name,
        secondaryName,
        highlight,
        price: +price,
        discount: +discount,
        duration,
        startDate,
        endDate,
        openingHour,
        closingHour,
        currencyId: currency?.value || "",
        ownerId: owner?.value || "",
        categoryId: category?.value || "",
      };

      setData(dataToSave);
      onChange(false);
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
        updateFormState("owner", { label: findOwner.companyName, value: findOwner.id });
      }
    }
  }, [currencies, owners]);

  return (
    <>
      <h2 className="heading">General</h2>
      <div className="mt-6 space-y-8">
        <FormField label="Name" required>
          <input type="text" className="input-text" placeholder="Urna Santal Villa" value={formState.name} onChange={(e) => updateFormState("name", e.target.value)} required />
        </FormField>

        <FormField label="Secondary name" required>
          <input type="text" className="input-text" placeholder="Urna Cangau" value={formState.secondaryName} onChange={(e) => updateFormState("secondaryName", e.target.value)} required />
        </FormField>

        <FormField label="Contact Person (Owner)" required>
          <Select
            className="w-full text-sm"
            options={owners?.data.data.map((owner) => ({ value: owner.id, label: owner.companyName }))}
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

        <FormField label="Highlights" required>
          <textarea
            className="h-40 input-text"
            value={formState.highlight}
            onChange={(e) => updateFormState("highlight", e.target.value)}
            placeholder="The beautiful Uma Santai Villa is set in the background of the Kerobokan paddy fields swaying in the tropical wind."
            required
          />
        </FormField>

        <div className="space-y-4">
          <FormField label="Price" required>
            <div className="flex items-center w-full gap-4">
              <div className="flex items-center w-full gap-2 max-w-80">
                <NumberInput className="input-text max-w-72 placeholder:text-dark" value={formState.price} onChange={(e) => handlePriceChange(e.target.value)} placeholder={`0`} required />
                <p>{formState.currency ? formState.currency?.label : ""}</p>
              </div>

              <div className="flex items-center justify-center w-full gap-8">
                <p>Discount*</p>
                <div className="flex gap-4">
                  {(["Yes", "No"] as const).map((status, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <label className="cursor-pointer" htmlFor={status}>
                        {status}
                      </label>
                      <input
                        type="checkbox"
                        id={status}
                        className="cursor-pointer accent-primary"
                        checked={formState.isDiscount === (status === "Yes")}
                        onChange={() => updateFormState("isDiscount", status === "Yes")}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center w-full gap-2 max-w-60">
                <p>Discount</p>
                <NumberInput
                  className="input-text max-w-32 placeholder:text-dark"
                  value={formState.discount}
                  onChange={(e) => handleDiscountChange(e.target.value)}
                  placeholder="0"
                  disabled={formState.isDiscount}
                />
                <p>%</p>
              </div>
            </div>
          </FormField>
          <div className="flex justify-end">
            <p className="w-full text-sm italic whitespace-nowrap max-w-40">Final Price : {calculatePrice(formState.price, formState.discount)}</p>
          </div>
        </div>
      </div>
    </>
  );
};
