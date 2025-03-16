import * as React from "react";
import { Button } from "../../../../../components";
import { useGetApi } from "../../../../../hooks";
import { baseApiURL } from "../../../../../static";
import { Currency, Data, Payload } from "../../../../../types";

type AvailabilityType = "daily" | "monthly" | "yearly";

export const General = () => {
  const [name, setName] = React.useState<string>("");
  const [secondaryName, setSecondaryName] = React.useState<string>("");
  const [highlight, setHighlight] = React.useState<string>("");

  // price state
  const [availability, setAvailability] = React.useState<Record<AvailabilityType, boolean>>({ daily: true, monthly: false, yearly: false });
  const [prices, setPrices] = React.useState<Record<AvailabilityType, string>>({ daily: "", monthly: "", yearly: "" });

  // discount state
  const [discount, setDiscount] = React.useState<Record<AvailabilityType, string>>({ daily: "", monthly: "", yearly: "" });

  // currency state
  const [currency, setCurrency] = React.useState<string>("");
  const [currencySymbol, setCurrencySymbol] = React.useState<string>("USD");

  // availability per price
  const [availabilityPriceMonthly, setAvailabilityPriceMonthly] = React.useState<string>("");
  const [availabilityPriceYearly, setAvailabilityPriceYearly] = React.useState<string>("");

  const { data: currencies } = useGetApi<Payload<Data<Currency[]>>>({
    key: ["currencies"],
    url: `${baseApiURL}/currencies`,
  });

  const handleAvailabilityChange = (type: keyof typeof availability) => {
    setAvailability((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handlePriceChange = (type: string, value: string) => {
    if (+value < 0 || value === "-" || value === "+" || value === "/" || value === "*" || value === "=" || value === "e") {
      return;
    } else {
      setPrices((prev) => ({ ...prev, [type]: value }));
    }
  };

  const handleCurrencyChange = (currencyId: string, currencySymbol: string) => {
    setCurrency(currencyId);
    setCurrencySymbol(currencySymbol);
  };

  const handleDiscountChange = (key: string, value: string) => {
    if (+value < 0 || +value > 100 || value === "-" || value === "+" || value === "/" || value === "*" || value === "=" || value === "e") {
      return;
    } else {
      setDiscount((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleSubmitGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedData = {
      name,
      secondaryName,
      highlight,
      currency,
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
      availability: [availability.daily ? "daily" : null, availability.monthly ? "monthly" : null, availability.yearly ? "yearly" : null],
      priceDaily: availability.daily ? +prices.daily : 0,
      priceMonthly: availability.monthly ? +prices.monthly : 0,
      priceYearly: availability.yearly ? +prices.yearly : 0,
      discountDaily: availability.daily ? +discount.daily : 0,
      discountMonthly: availability.monthly ? +discount.monthly : 0,
      discountYearly: availability.yearly ? +discount.yearly : 0,
    };
    console.log(formattedData);
  };

  const handleCancel = () => {
    alert("Changes discarded!");
    // Add logic to discard changes
  };

  return (
    <div className="p-8 border rounded-b bg-light border-dark/20">
      <h2 className="heading">General</h2>
      <form className="mt-6 space-y-8" onSubmit={handleSubmitGeneral}>
        {/* Property name */}
        <div className="flex items-center">
          <label className="block whitespace-nowrap min-w-60">Property name *</label>
          <input type="text" className="input-text" placeholder="Urna Santal Villa" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="flex items-center">
          <label className="block whitespace-nowrap min-w-60">Secondary property name *</label>
          <input type="text" className="input-text" placeholder="Urna Cangau" value={secondaryName} onChange={(e) => setSecondaryName(e.target.value)} />
        </div>

        {/* Availability Checkboxes */}
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

        {/* Currency select */}
        <div className="flex items-center">
          <label className="block whitespace-nowrap min-w-60">Currency *</label>
          <select onChange={(e) => handleCurrencyChange(e.target.value, currencies?.data.data[e.target.selectedIndex].code!)} className="w-full input-select">
            {currencies?.data.data.map((currency) => (
              <option key={currency.id} value={currency.id}>
                {currency.code}
              </option>
            ))}
          </select>
        </div>

        {/* Price Inputs */}
        <div className="space-y-4">
          {(["daily", "monthly", "yearly"] as const)
            .filter((type) => availability[type] === true)
            .map((type) => (
              <div key={type} className="flex items-center">
                <label className="block whitespace-nowrap min-w-60">Price ({type}) *</label>

                <div className="flex items-center w-full gap-4">
                  {/* Price Input */}
                  <input type="text" className="input-text" value={prices[type]} onChange={(e) => handlePriceChange(type, e.target.value)} placeholder={`Enter price in ${currencySymbol}`} />

                  <label className="block whitespace-nowrap">Discount</label>

                  <input type="number" className="input-text" value={discount[type]} onChange={(e) => handleDiscountChange(type, e.target.value)} placeholder="e.g. 0%" />

                  <label className="block whitespace-nowrap">Discounted Price</label>

                  <input type="text" className="input-text" value={+prices[type] - +prices[type] * (+discount[type] / 100)} readOnly />
                </div>
              </div>
            ))}
        </div>

        {availability["monthly"] && (
          <div className="flex items-center">
            <label className="block whitespace-nowrap min-w-60">
              Availability per price <br /> (Monthly) *
            </label>

            <select onChange={(e) => setAvailabilityPriceMonthly(e.target.value)} className="w-full input-select">
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

            <select onChange={(e) => setAvailabilityPriceYearly(e.target.value)} className="w-full input-select">
              {[...Array(10)].map((_, index) => (
                <option key={index} value={index + 1}>
                  {index + 1}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Highlights Section */}
        <div className="flex items-center">
          <label className="block whitespace-nowrap min-w-60">Highlights *</label>
          <textarea
            className="h-40 input-text"
            value={highlight}
            onChange={(e) => setHighlight(e.target.value)}
            placeholder="The beautiful Uma Santai Villa is set in the background of the Kerobokan paddy fields swaying in the tropical wind."
          />
        </div>

        {/* Save and Cancel Buttons */}
        <div className="flex justify-end gap-4">
          <Button className="btn-outline" onClick={handleCancel}>
            Reset
          </Button>
          <Button className="btn-primary" type="submit">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};
