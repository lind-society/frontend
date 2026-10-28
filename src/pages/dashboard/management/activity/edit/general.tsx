import * as React from "react";

import { useGetApiWithAuth, usePersistentData } from "../../../../../hooks";

import Select from "react-select";
import DatePicker from "react-datepicker";

import { Button, NumberInput, ToastMessage } from "../../../../../components";

import { FaEdit, FaEye } from "react-icons/fa";

import { dateToTimeString, timeStringToDate } from "../../../../../utils";

import { Activity, Category, Currency, Data, OptionType, Owner, Payload } from "../../../../../types";

interface FormState {
  name: string;
  secondaryName: string;
  highlight: string;
  price: string;
  priceUnit: string;
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
  const useStore = usePersistentData<Partial<Activity>>("get-activity");
  const useEdit = usePersistentData<Activity>("edit-activity");

  const { data: dataBeforeEdit } = useStore();
  const { setData, data: dataAfterEdit } = useEdit();

  const dataCondition =
    dataAfterEdit.name ||
    dataAfterEdit.highlight ||
    dataAfterEdit.secondaryName ||
    dataAfterEdit.currencyId ||
    dataAfterEdit.ownerId ||
    dataAfterEdit.categoryId ||
    dataAfterEdit.highlight ||
    dataAfterEdit.price ||
    dataAfterEdit.priceUnit ||
    dataAfterEdit.discount ||
    dataAfterEdit.dailyLimit ||
    dataAfterEdit.duration ||
    dataAfterEdit.startDate ||
    dataAfterEdit.endDate ||
    dataAfterEdit.openingHour ||
    dataAfterEdit.closingHour;

  const data = React.useMemo(() => {
    return dataCondition ? dataAfterEdit : dataBeforeEdit;
  }, [dataAfterEdit, dataBeforeEdit]);

  const { data: currencies } = useGetApiWithAuth<Payload<Data<Currency[]>>>({ key: ["currencies"], url: "/currencies" });
  const { data: categories } = useGetApiWithAuth<Payload<Data<Category[]>>>({ key: ["activity-categories"], url: "/activity-categories" });
  const { data: owners } = useGetApiWithAuth<Payload<Data<Owner[]>>>({ key: ["owners"], url: "/owners" });

  const [editMode, setEditMode] = React.useState<boolean>(false);

  const [formState, setFormState] = React.useState<FormState>({
    name: data.name || "",
    secondaryName: data.secondaryName || "",
    highlight: data.highlight || "",
    price: String(data.price || ""),
    priceUnit: data.priceUnit || "session",
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

  // Clamped rather than rejected — see the add-activity form for why a silent
  // `return` on an out-of-range keystroke lets the visible input drift away
  // from the real state (and from what Final Price is computed from).
  const MAX_PRICE = 999999999999999;

  const handlePriceChange = (value: string) => {
    if (value === "") return updateFormState("price", "");
    const clamped = Math.min(Math.max(+value, 0), MAX_PRICE);
    updateFormState("price", String(clamped));
  };

  const handleDiscountChange = (value: string) => {
    if (value === "") return updateFormState("discount", "");
    const clamped = Math.min(Math.max(+value, 0), 100);
    updateFormState("discount", String(clamped));
  };

  const calculatePrice = (price: string, discount: string) => {
    if (price === "") return "0";
    const result = +price - +price * (+discount || 0) / 100;
    return Number.isInteger(result) ? result.toString() : result.toFixed(2);
  };

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

  // Draft on every keystroke, in or out of Edit Mode — no click on Save
  // needed. This used to only report a hasChanges diff and never persist
  // anything until Save was pressed, so switching tabs (or closing the
  // browser) mid-edit silently threw the fields away.
  React.useEffect(() => {
    const { name, secondaryName, highlight, currency, owner, discount, price, priceUnit, category, dailyLimit, closingHour, duration, endDate, openingHour, startDate, isDiscount } = formState;

    const dataToSave = {
      name,
      secondaryName,
      highlight,
      price: +price || 0,
      priceUnit: priceUnit || "session",
      discount: isDiscount ? 0 : +discount || 0,
      duration,
      startDate: startDate?.toDateString() || "",
      endDate: endDate?.toDateString() || "",
      openingHour: dateToTimeString(openingHour),
      closingHour: dateToTimeString(closingHour),
      dailyLimit: +dailyLimit || 0,
      currencyId: currency?.value || "",
      ownerId: owner?.value || "",
      categoryId: category?.value || "",
    };

    setData(dataToSave);

    if (!onChange) return;

    const findCurrency = currencies?.data.data.find((c) => c.id === data.currencyId);
    const findOwner = owners?.data.data.find((o) => o.id === data.ownerId);
    const findCategory = categories?.data.data.find((o) => o.id === data.categoryId);

    const hasChanges =
      !arraysEqual(formState.name, data.name || "") ||
      !arraysEqual(formState.secondaryName, data.secondaryName || "") ||
      !arraysEqual(formState.highlight, data.highlight || "") ||
      !arraysEqual(formState.duration, data.duration || "") ||
      !arraysEqual(formState.price, String(data.price || "")) ||
      !arraysEqual(formState.priceUnit, data.priceUnit || "") ||
      !arraysEqual(formState.discount, String(data.discount || "")) ||
      !arraysEqual(formState.currency?.value || "", String(findCurrency?.id || "")) ||
      !arraysEqual(formState.owner?.value || "", String(findOwner?.id || "")) ||
      !arraysEqual(formState.category?.value || "", String(findCategory?.id || ""));

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
          <input type="text" className="input-text" placeholder="Activity Name" value={formState.name} onChange={(e) => updateFormState("name", e.target.value)} required />
        </FormField>

        <FormField label="Secondary name" required>
          <input type="text" className="input-text" placeholder="Secondary Activity Name" value={formState.secondaryName} onChange={(e) => updateFormState("secondaryName", e.target.value)} required />
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
              <label className="cursor-pointer" htmlFor={`${duration}-${index}`}>
                {duration}
              </label>
              <input
                type="checkbox"
                id={`${duration}-${index}`}
                className="cursor-pointer accent-primary"
                checked={formState.duration.includes(duration)}
                onChange={() => updateFormState("duration", duration)}
              />
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
                <p>/</p>
                <input
                  type="text"
                  className="input-text max-w-32"
                  value={formState.priceUnit}
                  onChange={(e) => updateFormState("priceUnit", e.target.value)}
                  placeholder="session"
                />
              </div>

              <div className="flex items-center justify-center w-full gap-8">
                <p>Discount*</p>
                <div className="flex gap-4">
                  {(["Yes", "No"] as const).map((status, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <label className="cursor-pointer" htmlFor={`${status}-${index}`}>
                        {status}
                      </label>
                      {/* `isDiscount` internally means "discount is OFF" — inverted
                          from the label. "Yes" must map to isDiscount=false so it
                          enables the field below. */}
                      <input
                        type="checkbox"
                        id={`${status}-${index}`}
                        className="cursor-pointer accent-primary"
                        checked={formState.isDiscount === (status === "No")}
                        onChange={() => updateFormState("isDiscount", status === "No")}
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

        <div className={`justify-end gap-4 ${editMode ? "flex" : "hidden"}`}>
          <Button className="btn-primary" type="submit">
            Save
          </Button>
        </div>
      </form>
    </>
  );
};
