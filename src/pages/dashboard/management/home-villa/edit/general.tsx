import * as React from "react";

import { useGetApi, useGetApiWithAuth, usePersistentData } from "../../../../../hooks";

import Select from "react-select";

import { Button, NumberInput, ToastMessage } from "../../../../../components";

import { FaEdit, FaEye } from "react-icons/fa";

import { capitalize } from "../../../../../utils";

import { Currency, Data, OptionType, Owner, Payload, Villa } from "../../../../../types";

type AvailabilityType = "daily" | "monthly" | "yearly";

interface FormState {
  name: string;
  secondaryName: string;
  highlight: string;
  availability: {
    daily: boolean;
    monthly: boolean;
    yearly: boolean;
  };
  price: Record<AvailabilityType, string>;
  discount: Record<AvailabilityType, string>;
  currency: OptionType | null;
  availabilityQuotaPerMonth: string;
  availabilityQuotaPerYear: string;
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

const arraysEqual = (a: string, b: string) => {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

export const General: React.FC<{ onChange?: (hasChanges: boolean) => void }> = ({ onChange }) => {
  // store data to session storage
  const useStore = usePersistentData<Villa>("get-villa");
  const useEdit = usePersistentData<Villa>("edit-villa");

  const { data: dataBeforeEdit } = useStore();
  const { setData, data: dataAfterEdit } = useEdit();

  const { data: currencies } = useGetApi<Payload<Data<Currency[]>>>({ key: ["currencies"], url: "currencies" });
  const { data: owners } = useGetApiWithAuth<Payload<Data<Owner[]>>>({ key: ["owners"], url: `owners` });

  const dataCondition =
    dataAfterEdit.name ||
    dataAfterEdit.highlight ||
    dataAfterEdit.secondaryName ||
    dataAfterEdit.currencyId ||
    dataAfterEdit.ownerId ||
    dataAfterEdit.availability?.daily ||
    dataAfterEdit.availability?.monthly ||
    dataAfterEdit.availability?.yearly ||
    dataAfterEdit.priceDaily ||
    dataAfterEdit.priceMonthly ||
    dataAfterEdit.priceYearly ||
    dataAfterEdit.discountDaily ||
    dataAfterEdit.discountMonthly ||
    dataAfterEdit.discountYearly ||
    dataAfterEdit.availabilityQuotaPerMonth ||
    dataAfterEdit.availabilityQuotaPerYear;

  const data = React.useMemo(() => {
    return dataCondition ? dataAfterEdit : dataBeforeEdit;
  }, [dataAfterEdit, dataBeforeEdit]);

  const [editMode, setEditMode] = React.useState<boolean>(false);

  const [formState, setFormState] = React.useState<FormState>({
    name: data.name || "",
    secondaryName: data.secondaryName || "",
    highlight: data.highlight || "",
    availability: {
      daily: data.availability?.daily || true,
      monthly: data.availability?.monthly || false,
      yearly: data.availability?.yearly || false,
    },
    price: {
      daily: String(data.priceDaily || ""),
      monthly: String(data.priceMonthly || ""),
      yearly: String(data.priceYearly || ""),
    },
    discount: {
      daily: String(data.discountDaily || ""),
      monthly: String(data.discountMonthly || ""),
      yearly: String(data.discountYearly || ""),
    },
    currency: null,
    availabilityQuotaPerMonth: String(data.availabilityQuotaPerMonth || ""),
    availabilityQuotaPerYear: String(data.availabilityQuotaPerYear || ""),
    owner: null,
  });

  // Check if form is complete
  React.useEffect(() => {
    if (!onChange) return;

    const findCurrency = currencies?.data.data.find((c) => c.id === data.currencyId);
    const findOwner = owners?.data.data.find((o) => o.id === data.ownerId);

    const hasChanges =
      !arraysEqual(formState.name, data.name || "") ||
      !arraysEqual(formState.secondaryName, data.secondaryName || "") ||
      !arraysEqual(formState.price.daily, String(data.priceDaily || "")) ||
      !arraysEqual(formState.price.monthly, String(data.priceMonthly || "")) ||
      !arraysEqual(formState.price.yearly, String(data.priceYearly || "")) ||
      !arraysEqual(formState.discount.daily, String(data.discountDaily || "")) ||
      !arraysEqual(formState.discount.monthly, String(data.discountMonthly || "")) ||
      !arraysEqual(formState.discount.yearly, String(data.discountYearly || "")) ||
      !arraysEqual(formState.currency?.value || "", String(findCurrency?.id || "")) ||
      !arraysEqual(formState.owner?.value || "", String(findOwner?.id || "")) ||
      !arraysEqual(formState.availabilityQuotaPerMonth, String(data.availabilityQuotaPerMonth || "")) ||
      !arraysEqual(formState.availabilityQuotaPerYear, String(data.availabilityQuotaPerYear || "")) ||
      !arraysEqual(formState.discount.yearly, String(data.discountYearly || "")) ||
      !(formState.availability.daily === data.availability?.daily) ||
      !(formState.availability.monthly === data.availability?.monthly) ||
      !(formState.availability.yearly === data.availability?.yearly);

    onChange(hasChanges);
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

  const updateFormState = (field: keyof Villa, value: string | OptionType | null) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (category: "price" | "availability" | "discount", field: AvailabilityType, value: string | boolean) => {
    setFormState((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  const handleAvailabilityChange = (type: AvailabilityType) => {
    const { availability } = formState;
    const isCurrentEnabled = availability[type];

    const otherEnabled = Object.entries(availability).some(([key, value]) => key !== type && value);

    if (!otherEnabled && isCurrentEnabled) return;

    updateNestedField("availability", type, !formState.availability[type]);
  };

  const handlePriceChange = (type: AvailabilityType, value: string) => {
    if (+value > 999999999999999 || +value < 0) return;
    updateNestedField("price", type, value);
  };

  const handleDiscountChange = (type: AvailabilityType, value: string) => {
    if (+value > 100 || +value < 0) return;
    updateNestedField("discount", type, value);
  };

  const calculateDiscountedPrice = (type: AvailabilityType) => {
    const basePrice = +formState.price[type] || 0;
    const discountPercent = +formState.discount[type] || 0;
    return basePrice - basePrice * (discountPercent / 100);
  };

  const handleSubmitGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, secondaryName, highlight, currency, owner, discount, price } = formState;

    const requiredFields = [name, secondaryName, highlight, currency, owner];

    const hasAnyOnePriceAndDiscount = Object.values(price).some((p) => !!p) && Object.values(discount).some((d) => !!d);

    const isComplete = requiredFields.every((field) => !!field) && hasAnyOnePriceAndDiscount;

    if (!isComplete) return;

    const dataToSave = {
      name: formState.name,
      secondaryName: formState.secondaryName,
      highlight: formState.highlight,
      currencyId: formState.currency?.value || "",
      ownerId: formState.owner?.value || "",
      availabilityQuotaPerMonth: formState.availability.monthly ? +formState.availabilityQuotaPerMonth : 0,
      availabilityQuotaPerYear: formState.availability.yearly ? +formState.availabilityQuotaPerYear : 0,
      availability: formState.availability,
      priceDaily: formState.availability.daily ? +formState.price.daily : 0,
      priceMonthly: formState.availability.monthly ? +formState.price.monthly : 0,
      priceYearly: formState.availability.yearly ? +formState.price.yearly : 0,
      discountDaily: formState.availability.daily ? +formState.discount.daily : 0,
      discountMonthly: formState.availability.monthly ? +formState.discount.monthly : 0,
      discountYearly: formState.availability.yearly ? +formState.discount.yearly : 0,
    };

    setData(dataToSave);
    ToastMessage({ message: "Success saving edit general...", color: "#22c55e" });
    setTimeout(() => {
      window.location.reload();
    }, 200);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="heading">General</h2>
        <Button className="btn-outline" onClick={() => setEditMode((prev) => !prev)}>
          {editMode ? (
            <div className="flex items-center gap-2">
              <FaEye size={18} />
              Show Mode
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <FaEdit size={18} />
              Edit Mode
            </div>
          )}
        </Button>
      </div>
      <form className="relative mt-6 space-y-8" onSubmit={handleSubmitGeneral}>
        <div className={`absolute inset-0 ${editMode ? "-z-1" : "z-2000"}`}></div>

        <FormField label="Name" required>
          <input type="text" className="input-text" placeholder="Urna Santal Villa" value={formState.name} onChange={(e) => updateFormState("name", e.target.value)} required />
        </FormField>

        <FormField label="Secondary name" required>
          <input type="text" className="input-text" placeholder="Urna Cangau" value={formState.secondaryName} onChange={(e) => updateFormState("secondaryName", e.target.value)} required />
        </FormField>

        <FormField label="Availability" required>
          <div className="flex items-center gap-4">
            {(["daily", "monthly", "yearly"] as const).map((type) => (
              <div key={type} className="flex items-center gap-2">
                <label className="cursor-pointer" htmlFor={type}>
                  {capitalize(type)}
                </label>
                <input type="checkbox" className="cursor-pointer accent-primary" checked={formState.availability[type]} onChange={() => handleAvailabilityChange(type)} />
              </div>
            ))}
          </div>
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

        <div className="space-y-4">
          {(["daily", "monthly", "yearly"] as const)
            .filter((type) => formState.availability[type] === true)
            .map((type) => (
              <FormField key={type} label={`Price (${type})`} required>
                <div className="flex items-center w-full gap-4">
                  <NumberInput
                    className="input-text"
                    value={formState.price[type]}
                    onChange={(e) => handlePriceChange(type, e.target.value)}
                    placeholder={`Enter price in ${formState.currency?.label}`}
                    required
                  />

                  <label className="block whitespace-nowrap">Discount</label>

                  <NumberInput className="input-text" value={formState.discount[type]} onChange={(e) => handleDiscountChange(type, e.target.value)} placeholder="e.g. 0%" />

                  <label className="block whitespace-nowrap">Discounted Price</label>

                  <input type="number" className="input-text" value={calculateDiscountedPrice(type)} readOnly />
                </div>
              </FormField>
            ))}
        </div>

        {formState.availability["monthly"] && (
          <FormField label="Minimum rent time (Monthly)" required>
            <select onChange={(e) => updateFormState("availabilityQuotaPerMonth", e.target.value)} value={formState.availabilityQuotaPerMonth} className="w-full input-select">
              {[...Array(12)].map((_, index) => (
                <option key={index} value={index + 1}>
                  {index + 1}
                </option>
              ))}
            </select>
          </FormField>
        )}

        {formState.availability["yearly"] && (
          <FormField label="Minimum rent time (Yearly)" required>
            <select onChange={(e) => updateFormState("availabilityQuotaPerYear", e.target.value)} value={formState.availabilityQuotaPerYear} className="w-full input-select">
              {[...Array(10)].map((_, index) => (
                <option key={index} value={index + 1}>
                  {index + 1}
                </option>
              ))}
            </select>
          </FormField>
        )}

        <FormField label="Highlights" required>
          <textarea
            className="h-40 input-text"
            value={formState.highlight}
            onChange={(e) => updateFormState("highlight", e.target.value)}
            placeholder="The beautiful Uma Santai Villa is set in the background of the Kerobokan paddy fields swaying in the tropical wind."
            required
          />
        </FormField>

        <div className={`justify-end gap-4 ${editMode ? "flex" : "hidden"}`}>
          <Button className="btn-primary" type="submit">
            Save
          </Button>
        </div>
      </form>
    </>
  );
};
