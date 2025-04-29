import * as React from "react";

import { useGetApi, useGetApiWithAuth, usePersistentData } from "../../../../../hooks";

import Select from "react-select";

import { NumberInput } from "../../../../../components";

import { capitalize } from "../../../../../utils";

import { Currency, Data, OptionType, Owner, Payload, Villa } from "../../../../../types";

type AvailabilityType = "monthly" | "yearly";

interface FormState {
  name: string;
  secondaryName: string;
  highlight: string;
  availability: {
    daily: boolean;
    monthly: boolean;
    yearly: boolean;
  };
  dailyBasePrice: string;
  lowSeasonPriceRate: string;
  highSeasonPriceRate: string;
  peakSeasonPriceRate: string;
  price: Record<AvailabilityType, string>;
  isDiscount: Record<AvailabilityType, boolean>;
  discount: Record<AvailabilityType, string>;
  currency: OptionType | null;
  availabilityQuotaPerMonth: string;
  availabilityQuotaPerYear: string;
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
  const useStore = usePersistentData<Partial<Villa>>("add-villa");
  const { setData, data } = useStore();

  const { data: currencies } = useGetApi<Payload<Data<Currency[]>>>({ key: ["currencies"], url: "currencies" });
  const { data: owners } = useGetApiWithAuth<Payload<Data<Owner[]>>>({ key: ["owners"], url: "/owners" });

  const [formState, setFormState] = React.useState<FormState>({
    name: data.name || "",
    secondaryName: data.secondaryName || "",
    highlight: data.highlight || "",
    availability: {
      daily: data.availability?.daily || true,
      monthly: data.availability?.monthly || false,
      yearly: data.availability?.yearly || false,
    },
    dailyBasePrice: String(data.dailyBasePrice || ""),
    lowSeasonPriceRate: String(data.lowSeasonPriceRate || ""),
    highSeasonPriceRate: String(data.highSeasonPriceRate || ""),
    peakSeasonPriceRate: String(data.peakSeasonPriceRate || ""),
    price: {
      monthly: String(data.priceMonthly || ""),
      yearly: String(data.priceYearly || ""),
    },
    isDiscount: {
      monthly: false,
      yearly: false,
    },
    discount: {
      monthly: String(data.discountMonthly || ""),
      yearly: String(data.discountYearly || ""),
    },
    currency: null,
    availabilityQuotaPerMonth: String(data.availabilityQuotaPerMonth || ""),
    availabilityQuotaPerYear: String(data.availabilityQuotaPerYear || ""),
    owner: null,
  });

  const updateFormState = (field: keyof FormState, value: string | boolean | OptionType | null) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (category: "price" | "availability" | "discount" | "isDiscount", field: "daily" | "monthly" | "yearly", value: string | boolean) => {
    setFormState((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  const handleAvailabilityChange = (type: "daily" | "monthly" | "yearly") => {
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

  const handlePriceRateChange = (type: "lowSeasonPriceRate" | "highSeasonPriceRate" | "peakSeasonPriceRate", value: string) => {
    if (+value > 999999999999999 || +value < 0) return;
    updateFormState(type, value);
  };

  const calculatePrice = (price: string, discount: string, isDiscount?: boolean) => {
    const result = isDiscount ? +price - +price * (+discount / 100) : +price + +price * (+discount / 100);
    return Number.isInteger(result) ? result.toString() : result.toFixed(2);
  };

  // Check if form is complete
  React.useEffect(() => {
    if (!onChange) return;

    const {
      name,
      secondaryName,
      highlight,
      currency,
      owner,
      discount,
      price,
      dailyBasePrice,
      lowSeasonPriceRate,
      highSeasonPriceRate,
      peakSeasonPriceRate,
      availabilityQuotaPerMonth,
      availabilityQuotaPerYear,
      isDiscount,
      availability,
    } = formState;

    const requiredFields = [name, secondaryName, highlight, currency, owner];

    const daily = [dailyBasePrice, lowSeasonPriceRate, highSeasonPriceRate, peakSeasonPriceRate].every((field) => !!field);

    const monthly = [price.monthly, discount.monthly, availabilityQuotaPerMonth, isDiscount.monthly].every((field) => !!field);

    const yearly = [price.yearly, discount.yearly, availabilityQuotaPerYear, isDiscount.yearly].every((field) => !!field);

    const hasAnyOnePriceAndDiscount = daily || monthly || yearly;

    const isComplete = requiredFields.every((field) => !!field) && hasAnyOnePriceAndDiscount;

    if (isComplete) {
      const dataToSave = {
        name,
        secondaryName,
        highlight,
        currencyId: currency?.value || "",
        ownerId: owner?.value || "",
        availability: availability,
        dailyBasePrice: availability.daily ? +dailyBasePrice : 0,
        lowSeasonPriceRate: availability.daily ? +lowSeasonPriceRate : 0,
        highSeasonPriceRate: availability.daily ? +highSeasonPriceRate : 0,
        peakSeasonPriceRate: availability.daily ? +peakSeasonPriceRate : 0,
        availabilityQuotaPerMonth: availability.monthly ? +availabilityQuotaPerMonth : 0,
        availabilityQuotaPerYear: availability.yearly ? +availabilityQuotaPerYear : 0,
        priceMonthly: availability.monthly ? +price.monthly : 0,
        priceYearly: availability.yearly ? +price.yearly : 0,
        discountMonthly: availability.monthly ? +discount.monthly : 0,
        discountYearly: availability.yearly ? +discount.yearly : 0,
        checkInHour: "00:00",
        checkOutHour: "00:00",
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

        <FormField label="Availability" required>
          <div className="flex items-center gap-4">
            {(["daily", "monthly", "yearly"] as const).map((type) => (
              <div key={type} className="flex items-center gap-2">
                <p>{capitalize(type)}</p>
                <input type="checkbox" className="cursor-pointer accent-primary" checked={formState.availability[type]} onChange={() => handleAvailabilityChange(type)} />
              </div>
            ))}
          </div>
        </FormField>

        <FormField label="Owner" required>
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

        {formState.availability["daily"] && (
          <div className="space-y-6">
            <FormField label="Daily Base Price" required>
              <NumberInput
                className="input-text placeholder:text-dark"
                value={formState.dailyBasePrice}
                onChange={(e) => updateFormState("dailyBasePrice", e.target.value)}
                placeholder={`0`}
                required
              />
              {formState.currency && <p className="pl-2">{formState.currency ? formState.currency?.label : ""}</p>}
            </FormField>
            <div className="grid grid-cols-3 gap-16 px-8">
              <div className="space-y-2.5 text-center">
                <p className="leading-5">Low Season Price Rate*</p>
                <div className="flex items-center">
                  <NumberInput
                    value={formState.lowSeasonPriceRate}
                    onChange={(e) => handlePriceRateChange("lowSeasonPriceRate", e.target.value)}
                    className="input-text placeholder:text-dark"
                    placeholder="0"
                  />
                  <p className="ml-2">{formState.currency ? formState.currency?.label : ""}</p>
                </div>
              </div>
              <div className="space-y-2.5 text-center">
                <p className="leading-5">High Season Price Rate*</p>
                <div className="flex items-center">
                  <NumberInput
                    value={formState.highSeasonPriceRate}
                    onChange={(e) => handlePriceRateChange("highSeasonPriceRate", e.target.value)}
                    className="input-text placeholder:text-dark"
                    placeholder="0"
                  />
                  <p className="ml-2">{formState.currency ? formState.currency?.label : ""}</p>
                </div>
              </div>
              <div className="space-y-2.5 text-center">
                <p className="leading-5">Peak Season Price Rate*</p>
                <div className="flex items-center">
                  <NumberInput
                    value={formState.peakSeasonPriceRate}
                    onChange={(e) => handlePriceRateChange("peakSeasonPriceRate", e.target.value)}
                    className="input-text placeholder:text-dark"
                    placeholder="0"
                  />
                  <p className="ml-2">{formState.currency ? formState.currency?.label : ""}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {(["monthly", "yearly"] as const)
            .filter((type) => formState.availability[type] === true)
            .map((type) => (
              <div key={type} className="space-y-4">
                <FormField label={`Price ${type}`} required>
                  <div className="flex items-center w-full gap-4">
                    <div className="flex items-center w-full gap-2 max-w-80">
                      <NumberInput
                        className="input-text max-w-72 placeholder:text-dark"
                        value={formState.price[type]}
                        onChange={(e) => handlePriceChange(type, e.target.value)}
                        placeholder={`0`}
                        required
                      />
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
                              checked={formState.isDiscount[type] === (status === "Yes")}
                              onChange={() => updateNestedField("isDiscount", type, status === "Yes")}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center w-full gap-2 max-w-60">
                      <p>Discount</p>
                      <NumberInput
                        className="input-text max-w-32 placeholder:text-dark"
                        value={formState.discount[type]}
                        onChange={(e) => handleDiscountChange(type, e.target.value)}
                        placeholder="0"
                        disabled={formState.isDiscount[type]}
                      />
                      <p>%</p>
                    </div>
                  </div>
                </FormField>
                <div className="flex justify-end">
                  <p className="w-full text-sm italic whitespace-nowrap max-w-40">Final Price : {calculatePrice(formState.price[type], formState.discount[type], true)}</p>
                </div>

                <FormField label={`Minimum stay (${type})`} required>
                  <select
                    onChange={(e) => updateFormState(type === "monthly" ? "availabilityQuotaPerMonth" : "availabilityQuotaPerYear", e.target.value)}
                    value={type === "monthly" ? formState.availabilityQuotaPerMonth : formState.availabilityQuotaPerYear}
                    className="w-full input-select"
                  >
                    {[...Array(type === "monthly" ? 12 : 10)].map((_, index) => (
                      <option key={index} value={index + 1}>
                        {index + 1}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>
            ))}
        </div>

        <FormField label="Highlights" required>
          <textarea
            className="h-40 input-text"
            value={formState.highlight}
            onChange={(e) => updateFormState("highlight", e.target.value)}
            placeholder="The beautiful Uma Santai Villa is set in the background of the Kerobokan paddy fields swaying in the tropical wind."
            required
          />
        </FormField>
      </div>
    </>
  );
};
