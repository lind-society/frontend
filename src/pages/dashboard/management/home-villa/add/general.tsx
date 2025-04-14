import * as React from "react";

import { useGetApi, useGetApiWithAuth, usePersistentData } from "../../../../../hooks";

import Select from "react-select";

import { NumberInput } from "../../../../../components";

import { Currency, Data, OptionType, Owner, Payload, Villa } from "../../../../../types";

type AvailabilityType = "daily" | "monthly" | "yearly";

interface FormState {
  name: string;
  secondaryName: string;
  highlight: string;
  availability: Record<AvailabilityType, boolean>;
  price: Record<AvailabilityType, string>;
  discount: Record<AvailabilityType, string>;
  currency: OptionType | null;
  availabilityPerPrice: {
    monthly: string;
    yearly: string;
  };
  owner: OptionType | null;
}

// Reusable form field component
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
  const useStore = usePersistentData<Partial<Villa>>("add-villa");
  const { setData, data } = useStore();

  const { data: currencies } = useGetApi<Payload<Data<Currency[]>>>({ key: ["currencies"], url: `currencies` });

  const { data: owners } = useGetApiWithAuth<Payload<Data<Owner[]>>>({ key: ["owners"], url: `owners` });

  // Initialize form state with existing data
  const [formState, setFormState] = React.useState<FormState>({
    name: data.name || "",
    secondaryName: data.secondaryName || "",
    highlight: data.highlight || "",
    availability: {
      daily: data.availability?.includes("daily") || true,
      monthly: data.availability?.includes("monthly") || false,
      yearly: data.availability?.includes("yearly") || false,
    },
    price: {
      daily: String(data.priceDaily) || "",
      monthly: String(data.priceMonthly) || "",
      yearly: String(data.priceYearly) || "",
    },
    discount: {
      daily: String(data.discountDaily) || "",
      monthly: String(data.discountMonthly) || "",
      yearly: String(data.discountYearly) || "",
    },
    currency: null,
    availabilityPerPrice: {
      monthly: String(data.availabilityPerPrice?.find((item) => item.availability === "monthly")?.quota) || "",
      yearly: String(data.availabilityPerPrice?.find((item) => item.availability === "yearly")?.quota) || "",
    },
    owner: null,
  });

  // Track if form is complete
  const [isFormComplete, setIsFormComplete] = React.useState(false);

  // Update form state helper
  const updateFormState = (field: string, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  // Fixed updateNestedState function
  const updateNestedState = <T extends keyof FormState>(parent: T, key: string, value: any) => {
    setFormState((prev) => {
      // Create a safe copy of the nested object
      const parentObj = prev[parent];
      const updatedParentObj = typeof parentObj === "object" && parentObj !== null ? { ...(parentObj as object), [key]: value } : { [key]: value };

      return { ...prev, [parent]: updatedParentObj };
    });
  };

  // Handle availability toggle
  const handleAvailabilityChange = (type: AvailabilityType) => {
    // Check if this is the only enabled availability and we're trying to disable it
    const isOnlyEnabledType = Object.entries(formState.availability)
      .filter(([key]) => key !== type)
      .every(([_, isEnabled]) => !isEnabled);

    // If this is the only enabled type and we're trying to disable it, prevent the change
    if (isOnlyEnabledType && formState.availability[type]) {
      alert("At least one availability type must be selected");
      return;
    }

    updateNestedState("availability", type, !formState.availability[type]);
  };

  // Handle price change
  const handlePriceChange = (type: AvailabilityType, value: string) => {
    if (+value > 999999999999999 || +value < 0) return;
    updateNestedState("price", type, value);
  };

  // Handle discount change
  const handleDiscountChange = (type: AvailabilityType, value: string) => {
    if (+value > 100 || +value < 0) return;
    updateNestedState("discount", type, value);
  };

  // Calculate discounted price
  const calculateDiscountedPrice = (type: AvailabilityType) => {
    const basePrice = +formState.price[type] || 0;
    const discountPercent = +formState.discount[type] || 0;
    return basePrice - basePrice * (discountPercent / 100);
  };

  // Save data function
  const saveData = () => {
    const formattedData = {
      name: formState.name,
      secondaryName: formState.secondaryName,
      highlight: formState.highlight,
      currencyId: formState.currency?.value || "",
      ownerId: formState.owner?.value || "",
      availabilityPerPrice: [
        { quota: +formState.availabilityPerPrice.monthly || 0, availability: "monthly" },
        { quota: +formState.availabilityPerPrice.yearly || 0, availability: "yearly" },
      ],
      availability: Object.entries(formState.availability)
        .filter(([_, isEnabled]) => isEnabled)
        .map(([type]) => type) as string[],
      priceDaily: formState.availability.daily ? +formState.price.daily : 0,
      priceMonthly: formState.availability.monthly ? +formState.price.monthly : 0,
      priceYearly: formState.availability.yearly ? +formState.price.yearly : 0,
      discountDaily: formState.availability.daily ? +formState.discount.daily : 0,
      discountMonthly: formState.availability.monthly ? +formState.discount.monthly : 0,
      discountYearly: formState.availability.yearly ? +formState.discount.yearly : 0,
      checkOutHour: "01:00",
      checkInHour: "12:00",
    };

    setData(formattedData);
  };

  // Check if form is complete
  React.useEffect(() => {
    if (!onChange) return;

    const { name, secondaryName, highlight, currency, owner, availability, price } = formState;

    const requiredFields = [name, secondaryName, highlight];
    const requiredObjects = [currency, owner];

    const isPriceValid = Object.entries(availability)
      .filter(([_, isEnabled]) => isEnabled)
      .every(([type]) => !!price[type as AvailabilityType]);

    const hasValidMinRentTimes = (!availability.monthly || !!formState.availabilityPerPrice.monthly) && (!availability.yearly || !!formState.availabilityPerPrice.yearly);

    const isComplete = requiredFields.every((field) => !!field) && requiredObjects.every((obj) => !!obj) && isPriceValid && hasValidMinRentTimes;

    onChange(isComplete);
    setIsFormComplete(isComplete);
  }, [formState]);

  // Auto-save when form is complete
  React.useEffect(() => {
    if (isFormComplete) {
      saveData();
    }
  }, [isFormComplete]);

  // Set currency and owners when data is loaded
  React.useEffect(() => {
    if (currencies && owners) {
      const findCurrency = currencies.data.data.find((c) => c.id === data.currencyId);
      const findOwner = owners.data.data.find((o) => o.id === data.ownerId);

      if (findCurrency && findOwner) {
        updateFormState("currency", { label: findCurrency.code, value: findCurrency.id });
        updateFormState("owner", { label: findOwner.name, value: findOwner.id });
      }
    }
  }, [currencies, owners]);

  return (
    <div className="p-8 border rounded-b bg-light border-dark/30">
      <h2 className="heading">General</h2>
      <form className="mt-6 space-y-8">
        <FormField label="Property name" required>
          <input type="text" className="input-text" placeholder="Urna Santal Villa" value={formState.name} onChange={(e) => updateFormState("name", e.target.value)} required />
        </FormField>

        <FormField label="Secondary property name" required>
          <input type="text" className="input-text" placeholder="Urna Cangau" value={formState.secondaryName} onChange={(e) => updateFormState("secondaryName", e.target.value)} required />
        </FormField>

        <FormField label="Availability" required>
          <div className="flex items-center gap-4">
            {(["daily", "monthly", "yearly"] as const).map((type) => (
              <div key={type} className="flex items-center gap-2">
                <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                <input type="checkbox" className="accent-primary" checked={formState.availability[type]} onChange={() => handleAvailabilityChange(type)} />
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
            <select onChange={(e) => updateNestedState("availabilityPerPrice", "monthly", e.target.value)} value={formState.availabilityPerPrice.monthly} className="w-full input-select">
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
            <select onChange={(e) => updateNestedState("availabilityPerPrice", "yearly", e.target.value)} value={formState.availabilityPerPrice.yearly} className="w-full input-select">
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
      </form>
    </div>
  );
};
