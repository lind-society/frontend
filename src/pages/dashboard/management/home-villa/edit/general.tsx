import * as React from "react";
import { Button } from "../../../../../components";
import { FaRegEdit } from "react-icons/fa";

type AvailabilityType = "daily" | "monthly" | "yearly";

export const General = () => {
  const [isEdit, setIsEdit] = React.useState<boolean>(false);

  const [propertyName, setPropertyName] = React.useState<string>("");
  const [secondPropertyName, setSecondPropertyName] = React.useState<string>("");
  const [highlights, setHighlights] = React.useState<string>("");

  // price state
  const [availability, setAvailability] = React.useState<Record<AvailabilityType, boolean>>({ daily: false, monthly: false, yearly: false });
  const [prices, setPrices] = React.useState<Record<AvailabilityType, string>>({ daily: "", monthly: "", yearly: "" });
  const [currency, setCurrency] = React.useState<string>("Rp");

  // discount state
  const [discount, setDiscount] = React.useState({ isDiscounted: false, discountType: "percentage", discountValue: "" });

  const handleAvailabilityChange = (type: keyof typeof availability) => {
    setAvailability((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handlePriceChange = (type: keyof typeof prices, value: string) => {
    setPrices((prev) => ({ ...prev, [type]: value }));
  };

  const handleCurrencyChange = (value: string) => {
    setCurrency(value);
  };

  const handleDiscountChange = (key: string, value: any) => {
    setDiscount((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    alert("Changes saved!");
    // Add logic to save changes
  };

  const handleCancel = () => {
    alert("Changes discarded!");
    // Add logic to discard changes
  };

  return (
    <div className="p-8 border rounded-b bg-light border-dark/20">
      <div className="flex items-center justify-between">
        <h2 className="heading">General</h2>
        <Button onClick={() => setIsEdit((prev) => !prev)} className={`flex items-center gap-2 border border-dark/20 ${isEdit ? "bg-light text-primary" : "bg-primary text-light"}`}>
          <FaRegEdit /> Edit
        </Button>
      </div>
      <form className="mt-6 space-y-8">
        {/* Property name */}
        <div className="flex items-center">
          <label className="block whitespace-nowrap min-w-60">Property name*</label>
          <input type="text" className="input-text" placeholder="Urna Santal Villa" value={propertyName} onChange={(e) => setPropertyName(e.target.value)} readOnly={isEdit} />
        </div>
        <div className="flex items-center">
          <label className="block whitespace-nowrap min-w-60">Secondary property name*</label>
          <input type="text" className="input-text" placeholder="Urna Cangau" value={secondPropertyName} onChange={(e) => setSecondPropertyName(e.target.value)} readOnly={isEdit} />
        </div>

        {/* Availability Checkboxes */}
        {!isEdit && (
          <div className="flex items-center gap-4">
            <label className="block whitespace-nowrap min-w-60">Availability*</label>
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
        )}

        {/* Price Inputs */}
        <div className="space-y-4">
          {(["daily", "monthly", "yearly"] as const).map((type) => (
            <div key={type} className="flex items-center">
              <label className="block whitespace-nowrap min-w-60">Price ({type})*</label>

              <div className="flex items-center w-full gap-4">
                {/* Currency Select */}
                <select className="w-60 input-select" value={currency} onChange={(e) => handleCurrencyChange(e.target.value)} disabled={!availability[type]}>
                  <option value="Rp">Rupiah (Rp)</option>
                  <option value="$">Dollar ($)</option>
                </select>

                {/* Price Input */}
                <input
                  type="text"
                  className="input-text"
                  value={prices[type]}
                  onChange={(e) => handlePriceChange(type, e.target.value)}
                  disabled={!availability[type]}
                  placeholder={`Enter price in ${currency}`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Price After Discount */}
        <div className="flex items-center">
          <label className="block whitespace-nowrap min-w-60">Price after discount</label>
          <div className="flex items-center w-full gap-4">
            <input type="text" className="input-text" value={currency === "Rp" ? "Rupiah (Rp)" : "Dollar ($)"} placeholder={`Enter price in ${currency}`} readOnly />
            <select className="w-full input-select" value={discount.discountType} onChange={(e) => handleDiscountChange("discountType", e.target.value)} disabled={!discount.isDiscounted}>
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount</option>
            </select>

            <input
              type="text"
              className="input-text"
              value={discount.discountValue}
              onChange={(e) => handleDiscountChange("discountValue", e.target.value)}
              disabled={!discount.isDiscounted}
              placeholder={discount.discountType === "percentage" ? "e.g. 10" : "e.g. 50000"}
            />
          </div>
        </div>

        <div className="flex items-center">
          <label className="block whitespace-nowrap min-w-60">Availability per Price</label>
          <div className="flex w-full gap-4">
            <select className="w-full input-select">
              <option>Daily</option>
              <option>Monthly</option>
              <option>Yearly</option>
            </select>
            <select className="w-full input-select">
              {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Highlights Section */}
        <div className="flex items-center">
          <label className="block whitespace-nowrap min-w-60">Highlights</label>
          <textarea
            className="h-40 input-text"
            value={highlights}
            onChange={(e) => setHighlights(e.target.value)}
            placeholder="The beautiful Uma Santai Villa is set in the background of the Kerobokan paddy fields swaying in the tropical wind."
            readOnly={isEdit}
          />
        </div>

        {/* Save and Cancel Buttons */}
        {!isEdit && (
          <div className="flex justify-end gap-4">
            <Button className="btn-outline" onClick={handleCancel}>
              Reset
            </Button>
            <Button className="btn-primary" onClick={handleSave}>
              Save
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};
