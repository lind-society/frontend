import * as React from "react";

import { useGetApiWithAuth, usePersistentData } from "../../../../../hooks";

import Select from "react-select";

import { Button, NumberInput, ToastMessage } from "../../../../../components";

import { Currency, Data, OptionType, Owner, Payload, Property } from "../../../../../types";
import { FaEdit, FaEye } from "react-icons/fa";

interface FormState {
  name: string;
  secondaryName: string;
  highlight: string;
  price: string;
  discount: string;
  isDiscount: boolean;
  ownershipType: string;
  soldStatus: boolean;
  currency: OptionType | null;
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
  const useStore = usePersistentData<Property>("get-property");
  const useEdit = usePersistentData<Property>("edit-property");

  const { data: dataBeforeEdit } = useStore();
  const { setData, data: dataAfterEdit } = useEdit();

  const dataCondition =
    dataAfterEdit.name ||
    dataAfterEdit.highlight ||
    dataAfterEdit.secondaryName ||
    dataAfterEdit.currencyId ||
    dataAfterEdit.ownerId ||
    dataAfterEdit.price ||
    dataAfterEdit.soldStatus ||
    dataAfterEdit.ownershipType;

  const data = React.useMemo(() => {
    return dataCondition ? dataAfterEdit : dataBeforeEdit;
  }, [dataAfterEdit, dataBeforeEdit]);

  const { data: currencies } = useGetApiWithAuth<Payload<Data<Currency[]>>>({ key: ["currencies"], url: "/currencies" });
  const { data: owners } = useGetApiWithAuth<Payload<Data<Owner[]>>>({ key: ["owners"], url: "/owners" });

  const [editMode, setEditMode] = React.useState<boolean>(false);

  const [formState, setFormState] = React.useState<FormState>({
    name: data.name || "",
    secondaryName: data.secondaryName || "",
    highlight: data.highlight || "",
    price: String(data.price || ""),
    discount: String(data.discount || ""),
    isDiscount: data.discount ? false : true,
    soldStatus: data.soldStatus || false,
    ownershipType: data.ownershipType || "Leasehold",
    currency: null,
    owner: null,
  });

  const updateFormState = (field: keyof FormState, value: string | boolean | OptionType | null) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  // Clamped rather than rejected — see the add-buy form for why a silent
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
    const { name, secondaryName, highlight, currency, owner, price, isDiscount, soldStatus, ownershipType, discount } = formState;

    const dataToSave = {
      name,
      secondaryName,
      highlight,
      soldStatus,
      ownershipType,
      price: +price || 0,
      discount: isDiscount ? 0 : +discount || 0,
      currencyId: currency?.value || "",
      ownerId: owner?.value || "",
    };

    setData(dataToSave);

    if (!onChange) return;

    const findCurrency = currencies?.data.data.find((c) => c.id === data.currencyId);
    const findOwner = owners?.data.data.find((o) => o.id === data.ownerId);

    const hasChanges =
      !arraysEqual(formState.name, data.name || "") ||
      !arraysEqual(formState.secondaryName, data.secondaryName || "") ||
      !arraysEqual(formState.price, String(data.price || "")) ||
      !arraysEqual(formState.discount, String(data.discount || "")) ||
      !arraysEqual(formState.ownershipType, String(data.ownershipType || "")) ||
      !arraysEqual(formState.currency?.value || "", String(findCurrency?.id || "")) ||
      !arraysEqual(formState.owner?.value || "", String(findOwner?.id || "")) ||
      formState.soldStatus !== data.soldStatus;

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
      <form className="relative mt-4 space-y-8" onSubmit={handleSubmitGeneral}>
        <div className={`absolute inset-0 ${editMode ? "-z-1" : "z-5"}`}></div>
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
                      <label className="cursor-pointer" htmlFor={`${status}-${index}`}>
                        {status}
                      </label>
                      {/* `isDiscount` internally means "discount is OFF" — inverted
                          from the label. "Yes" must map to false so it enables
                          the field below. */}
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
                  value={formState.isDiscount ? 0 : formState.discount}
                  onChange={(e) => handleDiscountChange(e.target.value)}
                  placeholder="0"
                  disabled={formState.isDiscount}
                />
                <p>%</p>
              </div>
            </div>
          </FormField>
          <div className="flex justify-end">
            <p className="w-full text-sm italic whitespace-nowrap max-w-40">Final Price : {calculatePrice(formState.price, formState.discount, true)}</p>
          </div>
        </div>

        <FormField label="Ownership" required>
          {(["Freehold", "Leasehold"] as const).map((ownership, index) => (
            <div key={index} className="flex items-center gap-2 ms-4">
              <label className="cursor-pointer" htmlFor={`${ownership}-${index}`}>
                {ownership}
              </label>
              <input
                type="checkbox"
                id={`${ownership}-${index}`}
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
              <label className="cursor-pointer" htmlFor={`${status}-${index}`}>
                {status}
              </label>
              <input
                type="checkbox"
                id={`${status}-${index}`}
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
