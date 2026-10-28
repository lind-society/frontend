import * as React from "react";

import { useGetApiWithAuth, usePersistentData } from "../../../../../hooks";

import Select from "react-select";

import { Button, NumberInput, ToastMessage } from "../../../../../components";

import { FaEdit, FaEye } from "react-icons/fa";

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
  dailyPrice: string;
  lowSeasonDailyPrice: string;
  highSeasonDailyPrice: string;
  peakSeasonDailyPrice: string;
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

const arraysEqual = (a: string, b: string) => {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

export const GeneralTab: React.FC<{ onChange?: (hasChanges: boolean) => void }> = ({ onChange }) => {
  // store data to session storage
  const useStore = usePersistentData<Villa>("get-villa");
  const useEdit = usePersistentData<Villa>("edit-villa");

  const { data: dataBeforeEdit } = useStore();
  const { setData, data: dataAfterEdit } = useEdit();

  const { data: currencies } = useGetApiWithAuth<Payload<Data<Currency[]>>>({ key: ["currencies"], url: "/currencies" });
  const { data: owners } = useGetApiWithAuth<Payload<Data<Owner[]>>>({ key: ["owners"], url: "/owners" });

  const dataCondition =
    dataAfterEdit.name ||
    dataAfterEdit.highlight ||
    dataAfterEdit.secondaryName ||
    dataAfterEdit.currencyId ||
    dataAfterEdit.ownerId ||
    dataAfterEdit.availability?.daily ||
    dataAfterEdit.availability?.monthly ||
    dataAfterEdit.availability?.yearly ||
    dataAfterEdit.dailyPrice ||
    dataAfterEdit.lowSeasonDailyPrice ||
    dataAfterEdit.highSeasonDailyPrice ||
    dataAfterEdit.peakSeasonDailyPrice ||
    dataAfterEdit.priceMonthly ||
    dataAfterEdit.priceYearly ||
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
      daily: data.availability?.daily ?? true,
      monthly: data.availability?.monthly ?? false,
      yearly: data.availability?.yearly ?? false,
    },
    dailyPrice: String(data.dailyPrice || ""),
    lowSeasonDailyPrice: String(data.lowSeasonDailyPrice || ""),
    highSeasonDailyPrice: String(data.highSeasonDailyPrice || ""),
    peakSeasonDailyPrice: String(data.peakSeasonDailyPrice || ""),
    price: {
      monthly: String(data.priceMonthly || ""),
      yearly: String(data.priceYearly || ""),
    },
    isDiscount: {
      monthly: data.discountMonthly ? false : true,
      yearly: data.discountYearly ? false : true,
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

  // Clamped rather than rejected — see the add-villa form for why a silent
  // `return` on an out-of-range keystroke lets the visible input drift away
  // from the real state (and from what Final Price is computed from).
  const MAX_PRICE = 999999999999999;

  const handlePriceChange = (type: AvailabilityType, value: string) => {
    if (value === "") return updateNestedField("price", type, "");
    const clamped = Math.min(Math.max(+value, 0), MAX_PRICE);
    updateNestedField("price", type, String(clamped));
  };

  const handleDiscountChange = (type: AvailabilityType, value: string) => {
    if (value === "") return updateNestedField("discount", type, "");
    const clamped = Math.min(Math.max(+value, 0), 100);
    updateNestedField("discount", type, String(clamped));
  };

  const handlePriceDailyChange = (type: "lowSeasonDailyPrice" | "highSeasonDailyPrice" | "peakSeasonDailyPrice", value: string) => {
    if (value === "") return updateFormState(type, "");
    const clamped = Math.min(Math.max(+value, 0), MAX_PRICE);
    updateFormState(type, String(clamped));
  };

  const calculatePrice = (price: string, discount: string, isDiscount?: boolean) => {
    if (price === "") return "0";
    const factor = (+discount || 0) / 100;
    const result = isDiscount ? +price - +price * factor : +price + +price * factor;
    return Number.isInteger(result) ? result.toString() : result.toFixed(2);
  };

  // Draft on every keystroke, in or out of Edit Mode — no click on Save
  // needed. This used to only report a hasChanges diff and never persist
  // anything until Save was pressed, so switching tabs (or closing the
  // browser) mid-edit silently threw the fields away.
  React.useEffect(() => {
    const { name, secondaryName, highlight, currency, owner, discount, price, dailyPrice, lowSeasonDailyPrice, highSeasonDailyPrice, peakSeasonDailyPrice, availabilityQuotaPerMonth, availabilityQuotaPerYear, isDiscount, availability } = formState;

    const dataToSave = {
      name,
      secondaryName,
      highlight,
      // `currency`/`owner` start null and only resolve once the currencies/owners
      // lookups (and their id -> option match) finish — falling straight to ""
      // meant switching tabs before that resolved wrote an empty currencyId/
      // ownerId into the draft, silently and permanently until something reset
      // it, so Publish later failed 422 "ownerId must be a UUID" for a value
      // the admin never touched. Fall back to the value already on the villa
      // instead of blanking it out while the lookup is still in flight.
      currencyId: currency?.value || data.currencyId || "",
      ownerId: owner?.value || data.ownerId || "",
      availability: availability,
      dailyPrice: availability.daily ? +dailyPrice || 0 : 0,
      lowSeasonDailyPrice: availability.daily ? +lowSeasonDailyPrice || 0 : 0,
      highSeasonDailyPrice: availability.daily ? +highSeasonDailyPrice || 0 : 0,
      peakSeasonDailyPrice: availability.daily ? +peakSeasonDailyPrice || 0 : 0,
      availabilityQuotaPerMonth: availability.monthly ? +availabilityQuotaPerMonth || 0 : 0,
      availabilityQuotaPerYear: availability.yearly ? +availabilityQuotaPerYear || 0 : 0,
      priceMonthly: availability.monthly ? +price.monthly || 0 : 0,
      priceYearly: availability.yearly ? +price.yearly || 0 : 0,
      discountMonthly: isDiscount.monthly && availability.monthly ? 0 : +discount.monthly || 0,
      discountYearly: isDiscount.yearly && availability.yearly ? 0 : +discount.yearly || 0,
      checkInHour: "00:00",
      checkOutHour: "00:00",
    };

    setData(dataToSave);

    if (!onChange) return;

    const findCurrency = currencies?.data.data.find((c) => c.id === data.currencyId);
    const findOwner = owners?.data.data.find((o) => o.id === data.ownerId);

    const hasChanges =
      !arraysEqual(formState.name, data.name || "") ||
      !arraysEqual(formState.secondaryName, data.secondaryName || "") ||
      !arraysEqual(formState.price.monthly, String(data.priceMonthly || "")) ||
      !arraysEqual(formState.price.yearly, String(data.priceYearly || "")) ||
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

  const handleSubmitGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    // The effect above already drafts every keystroke — Save here just closes
    // out Edit Mode with a confirmation toast rather than persisting anything
    // new. Required-field completeness still isn't enforced on the draft
    // itself; the backend rejects an incomplete Publish with its own message.
    ToastMessage({ message: "Saved. Publish when you're ready to make it live.", color: "#22c55e" });
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
                <span className="block cursor-pointer">{capitalize(type)}</span>
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
              <NumberInput className="input-text placeholder:text-dark" value={formState.dailyPrice} onChange={(e) => updateFormState("dailyPrice", e.target.value)} placeholder={`0`} required />
              {formState.currency && <p className="pl-2">{formState.currency ? formState.currency?.label : ""}</p>}
            </FormField>
            <div className="grid grid-cols-3 gap-16 px-8">
              <div className="space-y-2.5 text-center">
                <p className="leading-5">Low Season Price *</p>
                <div className="flex items-center">
                  <NumberInput
                    value={formState.lowSeasonDailyPrice}
                    onChange={(e) => handlePriceDailyChange("lowSeasonDailyPrice", e.target.value)}
                    className="input-text placeholder:text-dark"
                    placeholder="0"
                  />
                  <p className="ml-2">{formState.currency ? formState.currency?.label : ""}</p>
                </div>
              </div>
              <div className="space-y-2.5 text-center">
                <p className="leading-5">High Season Price *</p>
                <div className="flex items-center">
                  <NumberInput
                    value={formState.highSeasonDailyPrice}
                    onChange={(e) => handlePriceDailyChange("highSeasonDailyPrice", e.target.value)}
                    className="input-text placeholder:text-dark"
                    placeholder="0"
                  />
                  <p className="ml-2">{formState.currency ? formState.currency?.label : ""}</p>
                </div>
              </div>
              <div className="space-y-2.5 text-center">
                <p className="leading-5">Peak Season Price *</p>
                <div className="flex items-center">
                  <NumberInput
                    value={formState.peakSeasonDailyPrice}
                    onChange={(e) => handlePriceDailyChange("peakSeasonDailyPrice", e.target.value)}
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
                        {(["Yes", "No"] as const).map((status) => (
                          <div key={status} className="flex items-center gap-2">
                            <label className="cursor-pointer" htmlFor={`${type}-${status}`}>
                              {status}
                            </label>
                            {/* `isDiscount` internally means "discount is OFF" —
                                inverted from the label. "Yes" must map to false
                                so it enables the field below. */}
                            <input
                              type="checkbox"
                              id={`${type}-${status}`}
                              className="cursor-pointer accent-primary"
                              checked={formState.isDiscount[type] === (status === "No")}
                              onChange={() => updateNestedField("isDiscount", type, status === "No")}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center w-full gap-2 max-w-60">
                      <p>Discount</p>
                      <NumberInput
                        className="input-text max-w-32 placeholder:text-dark"
                        value={formState.isDiscount[type] ? "0" : formState.discount[type]}
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
            placeholder="Sem et lacinia vestibulum enim suscipit nisi sociosqu imperdiet. Nisi integer sem rhoncus sociosqu dictum rutrum mattis. Erat tempor dapibus sed vel ac lectus rhoncus."
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
