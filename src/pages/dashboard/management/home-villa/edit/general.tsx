import * as React from "react";

import { useGetApi, usePersistentData } from "../../../../../hooks";

import Select from "react-select";

import { Button, NumberInput, ToastMessage } from "../../../../../components";

import { Currency, Data, Payload, Villa } from "../../../../../types";
import { FaEdit, FaEye } from "react-icons/fa";

type AvailabilityType = "daily" | "monthly" | "yearly";
type OptionType = { value: string; label: string };

const initAvailability = { daily: "", monthly: "", yearly: "" };

export const General = () => {
  // store data to session storage
  const useStore = usePersistentData<Villa>("get-villa");
  const useEdit = usePersistentData<Villa>("edit-villa");

  const { data: dataBeforeEdit } = useStore();
  const { setData, data: dataAfterEdit } = useEdit();

  const dataCondition = dataAfterEdit.name || dataAfterEdit.highlight || dataAfterEdit.secondaryName || dataAfterEdit.currencyId || dataAfterEdit.availability || dataAfterEdit.priceDaily;
  const data = dataCondition ? dataAfterEdit : dataBeforeEdit;

  const { data: currencies } = useGetApi<Payload<Data<Currency[]>>>({ key: ["currencies"], url: `currencies` });

  const defaultPrice = { daily: String(data.priceDaily), monthly: String(data.priceMonthly), yearly: String(data.priceYearly) };
  const defaultDiscount = { daily: String(data.discountDaily), monthly: String(data.discountMonthly), yearly: String(data.discountYearly) };
  const defaultAvailability = { daily: data.availability?.includes("daily") || true, monthly: data.availability?.includes("monthly") || false, yearly: data.availability?.includes("yearly") || false };
  const defaultAvailabilityPriceMonthly = String(data.availabilityPerPrice?.find((item) => item.availability === "monthly")?.quota);
  const defaultAvailabilityPriceYearly = String(data.availabilityPerPrice?.find((item) => item.availability === "yearly")?.quota);

  const [editMode, setEditMode] = React.useState<boolean>(false);

  const [name, setName] = React.useState<string>(data.name || "");
  const [secondaryName, setSecondaryName] = React.useState<string>(data.secondaryName || "");
  const [highlight, setHighlight] = React.useState<string>(data.highlight || "");
  const [availability, setAvailability] = React.useState<Record<AvailabilityType, boolean>>(defaultAvailability);
  const [price, setPrice] = React.useState<Record<AvailabilityType, string>>(defaultPrice || initAvailability);
  const [discount, setDiscount] = React.useState<Record<AvailabilityType, string>>(defaultDiscount || initAvailability);
  const [currency, setCurrency] = React.useState<OptionType | null>(null);
  const [availabilityPriceMonthly, setAvailabilityPriceMonthly] = React.useState<string>(defaultAvailabilityPriceMonthly || "");
  const [availabilityPriceYearly, setAvailabilityPriceYearly] = React.useState<string>(defaultAvailabilityPriceYearly || "");

  const handleAvailabilityChange = (type: keyof typeof availability) => {
    setAvailability((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handlePriceChange = (type: string, value: string) => {
    setPrice((prev) => ({ ...prev, [type]: value }));
  };

  const handleDiscountChange = (key: string, value: string) => {
    if (+value > 100 || +value < 0) return;
    setDiscount((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmitGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit general data here
    const formattedData = {
      name,
      secondaryName,
      highlight,
      currencyId: currency?.value,
      availabilityPerPrice: [
        {
          quota: +availabilityPriceMonthly || 0,
          availability: "monthly",
        },
        {
          quota: +availabilityPriceYearly || 0,
          availability: "yearly",
        },
      ],
      availability: [availability.daily ? "daily" : null, availability.monthly ? "monthly" : null, availability.yearly ? "yearly" : null].filter(Boolean) as string[],
      priceDaily: availability.daily ? +price.daily : 0,
      priceMonthly: availability.monthly ? +price.monthly : 0,
      priceYearly: availability.yearly ? +price.yearly : 0,
      discountDaily: availability.daily ? +discount.daily : 0,
      discountMonthly: availability.monthly ? +discount.monthly : 0,
      discountYearly: availability.yearly ? +discount.yearly : 0,
      checkOutHour: "10:00",
      checkInHour: "12:00",
    };

    setData(formattedData);
    ToastMessage({ message: "Success saving general", color: "#22c55e" });
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  React.useEffect(() => {
    if (currencies) {
      const findCurrency = currencies.data.data.find((c) => c.id === data.currencyId);

      if (findCurrency) {
        setCurrency({ label: findCurrency.code, value: findCurrency.id });
      }
    }
  }, [currencies]);

  return (
    <div className="p-8 border rounded-b bg-light border-dark/30">
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
      <form className="relative space-y-8" onSubmit={handleSubmitGeneral}>
        <div className={`absolute inset-0 ${editMode ? "-z-1" : "z-5"}`}></div>
        <div className="flex items-center">
          <label className="block whitespace-nowrap min-w-60">Property name *</label>
          <input type="text" className="input-text" placeholder="Urna Santal Villa" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="flex items-center">
          <label className="block whitespace-nowrap min-w-60">Secondary property name *</label>
          <input type="text" className="input-text" placeholder="Urna Cangau" value={secondaryName} onChange={(e) => setSecondaryName(e.target.value)} required />
        </div>

        <div className="flex items-center gap-4">
          <label className="block whitespace-nowrap min-w-60">Availability *</label>
          {(["daily", "monthly", "yearly"] as const).map((type) => (
            <div key={type} className="flex items-center gap-2">
              <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
              <input
                type="checkbox"
                className="accent-primary"
                checked={availability[type as keyof typeof availability]}
                onChange={() => handleAvailabilityChange(type as keyof typeof availability)}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center">
          <label className="block whitespace-nowrap min-w-60">Currency *</label>
          <Select
            className="w-full text-sm"
            options={currencies?.data.data.map((currency) => ({ value: currency.id, label: currency.code }))}
            value={currency}
            onChange={(option) => setCurrency(option)}
            placeholder="Select Currency"
            required
          />
        </div>

        <div className="space-y-4">
          {(["daily", "monthly", "yearly"] as const)
            .filter((type) => availability[type] === true)
            .map((type) => (
              <div key={type} className="flex items-center">
                <label className="block whitespace-nowrap min-w-60">Price ({type}) *</label>

                <div className="flex items-center w-full gap-4">
                  <NumberInput className="input-text" value={price[type]} onChange={(e) => handlePriceChange(type, e.target.value)} placeholder={`Enter price in ${currency?.label}`} required />

                  <label className="block whitespace-nowrap">Discount</label>

                  <NumberInput className="input-text" value={discount[type]} onChange={(e) => handleDiscountChange(type, e.target.value)} placeholder="e.g. 0%" />

                  <label className="block whitespace-nowrap">Discounted Price</label>

                  <input type="number" className="input-text" value={+price[type] - +price[type] * ((+discount[type] || 0) / 100) || 0} readOnly />
                </div>
              </div>
            ))}
        </div>

        {availability["monthly"] && (
          <div className="flex items-center">
            <label className="block whitespace-nowrap min-w-60">
              Availability per price <br /> (Monthly) *
            </label>

            <select onChange={(e) => setAvailabilityPriceMonthly(e.target.value)} value={availabilityPriceMonthly} className="w-full input-select">
              {[...Array(12)].map((_, index) => (
                <option key={index} value={index + 1}>
                  {index + 1}
                </option>
              ))}
            </select>
          </div>
        )}

        {availability["yearly"] && (
          <div className="flex items-center">
            <label className="block whitespace-nowrap min-w-60">
              Availability per price <br /> (Yearly) *
            </label>

            <select onChange={(e) => setAvailabilityPriceYearly(e.target.value)} value={availabilityPriceYearly} className="w-full input-select">
              {[...Array(10)].map((_, index) => (
                <option key={index} value={index + 1}>
                  {index + 1}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center">
          <label className="block whitespace-nowrap min-w-60">Highlights *</label>
          <textarea
            className="h-40 input-text"
            value={highlight}
            onChange={(e) => setHighlight(e.target.value)}
            placeholder="The beautiful Uma Santai Villa is set in the background of the Kerobokan paddy fields swaying in the tropical wind."
            required
          />
        </div>

        <div className={`justify-end gap-4 ${editMode ? "flex" : "hidden"}`}>
          <Button className="btn-primary" type="submit">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};
