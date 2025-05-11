import * as React from "react";

import { useGetApiWithAuth, usePersistentData } from "../../../../../hooks";

import Select from "react-select";
import DatePicker from "react-datepicker";

import { NumberInput } from "../../../../../components";

import { dateToTimeString, timeStringToDate } from "../../../../../utils";

import { Activity, Category, Currency, Data, OptionType, Owner, Payload } from "../../../../../types";

interface FormState {
  name: string;
  secondaryName: string;
  highlight: string;
  price: string;
  isDiscount: boolean;
  discount: string;
  duration: string;
  startDate: Date | null;
  endDate: Date | null;
  openingHour: Date | null;
  closingHour: Date | null;
  dailyLimit: string;
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

  const { data: currencies } = useGetApiWithAuth<Payload<Data<Currency[]>>>({ key: ["currencies"], url: "/currencies" });
  const { data: categories } = useGetApiWithAuth<Payload<Data<Category[]>>>({ key: ["activity-categories"], url: "/activity-categories" });
  const { data: owners } = useGetApiWithAuth<Payload<Data<Owner[]>>>({ key: ["owners"], url: "/owners" });

  const [formState, setFormState] = React.useState<FormState>({
    name: data.name || "",
    secondaryName: data.secondaryName || "",
    highlight: data.highlight || "",
    price: String(data.price || ""),
    isDiscount: data.discount ? false : true,
    discount: String(data.discount || ""),
    dailyLimit: String(data.dailyLimit || ""),
    duration: data.duration || "Temporary",
    startDate: new Date(data.startDate || Date.now()),
    endDate: new Date(data.endDate || Date.now()),
    openingHour: new Date(timeStringToDate(data.openingHour || "00:00") || Date.now()),
    closingHour: new Date(timeStringToDate(data.closingHour || "00:00") || Date.now()),
    currency: null,
    category: null,
    owner: null,
  });

  const updateFormState = (field: keyof FormState, value: string | boolean | OptionType | Date | null) => {
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

    const { name, secondaryName, highlight, currency, owner, discount, price, category, dailyLimit, closingHour, duration, endDate, openingHour, startDate, isDiscount } = formState;

    const requiredFields = [name, secondaryName, highlight, currency, owner, category, dailyLimit, closingHour, duration, endDate, openingHour, startDate];

    const isComplete = requiredFields.every((field) => !!field);

    if (isComplete) {
      const dataToSave = {
        name,
        secondaryName,
        highlight,
        price: +price,
        discount: isDiscount ? 0 : +discount,
        duration,
        startDate,
        endDate,
        openingHour: dateToTimeString(openingHour),
        closingHour: dateToTimeString(closingHour),
        dailyLimit: +dailyLimit,
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
    if (currencies && owners && categories) {
      const findCurrency = currencies.data.data.find((c) => c.id === data.currencyId);
      const findOwner = owners.data.data.find((o) => o.id === data.ownerId);
      const findCategory = categories.data.data.find((o) => o.id === data.categoryId);

      if (findCurrency) {
        updateFormState("currency", { label: findCurrency.code, value: findCurrency.id });
      }
      if (findOwner) {
        updateFormState("owner", { label: findOwner.companyName, value: findOwner.id });
      }
      if (findCategory) {
        updateFormState("category", { label: findCategory.name, value: findCategory.id });
      }
    }
  }, [currencies, owners, categories]);

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

        <FormField label="Category" required>
          <Select
            className="w-full text-sm"
            options={categories?.data.data.map((category) => ({ value: category.id, label: category.name }))}
            value={formState.category}
            onChange={(option) => updateFormState("category", option)}
            placeholder="Select Category"
            required
          />
        </FormField>

        <FormField label="Highlights" required>
          <textarea
            className="h-40 input-text"
            value={formState.highlight}
            onChange={(e) => updateFormState("highlight", e.target.value)}
            placeholder="Sem et lacinia vestibulum enim suscipit nisi sociosqu imperdiet. Nisi integer sem rhoncus sociosqu dictum rutrum mattis. Erat tempor dapibus sed vel ac lectus rhoncus."
            required
          />
        </FormField>

        <FormField label="Duration" required>
          {(["Permanent", "Temporary"] as const).map((duration, index) => (
            <div key={index} className="flex items-center gap-2 ms-4">
              <label className="cursor-pointer" htmlFor={duration}>
                {duration}
              </label>
              <input type="checkbox" id={duration} className="cursor-pointer accent-primary" checked={formState.duration.includes(duration)} onChange={() => updateFormState("duration", duration)} />
            </div>
          ))}
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

        <div className="flex items-center justify-between">
          <FormField label="Start Date" required>
            <div className="w-full datepicker-container">
              <DatePicker
                dateFormat="dd/MM/yyyy"
                selected={formState.startDate}
                toggleCalendarOnIconClick
                closeOnScroll
                onChange={(date) => updateFormState("startDate", date)}
                showIcon
                className="datepicker-input"
              />
            </div>
          </FormField>
          <FormField label="End Date" required>
            <div className="w-full datepicker-container">
              <DatePicker
                dateFormat="dd/MM/yyyy"
                selected={formState.endDate}
                toggleCalendarOnIconClick
                closeOnScroll
                onChange={(date) => updateFormState("endDate", date)}
                showIcon
                className="datepicker-input"
              />
            </div>
          </FormField>
        </div>

        <div className="flex items-center justify-between">
          <FormField label="Opening Hour" required>
            <div className="w-full datepicker-container">
              <DatePicker
                selected={formState.openingHour}
                toggleCalendarOnIconClick
                closeOnScroll
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                onChange={(date) => updateFormState("openingHour", date)}
                showIcon
                className="datepicker-input"
              />
            </div>
          </FormField>
          <FormField label="Closing Hour" required>
            <div className="w-full datepicker-container">
              <DatePicker
                selected={formState.closingHour}
                toggleCalendarOnIconClick
                closeOnScroll
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                onChange={(date) => updateFormState("closingHour", date)}
                showIcon
                className="datepicker-input"
              />
            </div>
          </FormField>
        </div>

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
                  value={formState.isDiscount ? "0" : formState.discount}
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

        <FormField label="Daily Limit" required>
          <select onChange={(e) => updateFormState("dailyLimit", e.target.value)} value={formState.dailyLimit} className="w-full input-select">
            {[...Array(31)].map((_, index) => (
              <option key={index} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
        </FormField>
      </div>
    </>
  );
};
