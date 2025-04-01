import * as React from "react";

import { useGetApi, useGetApiWithAuth, usePersistentData } from "../../../../../hooks";

import Select from "react-select";

import { Button, ToastMessage } from "../../../../../components";

import { Currency, Data, OptionType, Owner, Payload, Property } from "../../../../../types";

export const General = () => {
  // store data to session storage
  const useStore = usePersistentData<Partial<Property>>("add-property");
  const { setData, data } = useStore();

  const { data: currencies } = useGetApi<Payload<Data<Currency[]>>>({ key: ["currencies"], url: `currencies` });

  const { data: owners } = useGetApiWithAuth<Payload<Data<Owner[]>>>({ key: ["owners"], url: `owners` });

  const [name, setName] = React.useState<string>(data.name || "");
  const [secondaryName, setSecondaryName] = React.useState<string>(data.secondaryName || "");
  const [highlight, setHighlight] = React.useState<string>(data.highlight || "");
  const [price, setPrice] = React.useState<string>(String(data.price) || "");
  const [discount, setDiscount] = React.useState<string>(String(data.discount) || "");
  const [ownershipType, setOwnershipType] = React.useState<string>(data.ownershipType || "freehold");
  const [soldStatus, setSoldStatus] = React.useState<boolean>(data.soldStatus || false);
  const [currency, setCurrency] = React.useState<OptionType | null>(null);
  const [owner, setOwner] = React.useState<OptionType | null>(null);

  const handleSubmitGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedData = {
      name,
      secondaryName,
      highlight,
      currencyId: currency?.value || "",
      ownerId: owner?.value || "",
      ownershipType: ownershipType,
      price: +price || 0,
      discount: +discount || 0,
      soldStatus,
    };
    setData(formattedData);
    ToastMessage({ message: "Success saving general", color: "#22c55e" });
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  React.useEffect(() => {
    if (currencies && owners) {
      const findCurrency = currencies.data.data.find((c) => c.id === data.currencyId);
      const findOwner = owners.data.data.find((o) => o.id === data.ownerId);

      if (findCurrency && findOwner) {
        setCurrency({ label: findCurrency.code, value: findCurrency.id });
        setOwner({ label: findOwner.name, value: findOwner.id });
      }
    }
  }, [currencies, owners]);

  return (
    <div className="p-8 border rounded-b bg-light border-dark/30">
      <h2 className="heading">General</h2>
      <form className="mt-6 space-y-8" onSubmit={handleSubmitGeneral}>
        <div className="flex items-center">
          <label className="block whitespace-nowrap min-w-60">Property name *</label>
          <input type="text" className="input-text" placeholder="Urna Santal Villa" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="flex items-center">
          <label className="block whitespace-nowrap min-w-60">Secondary property name *</label>
          <input type="text" className="input-text" placeholder="Urna Cangau" value={secondaryName} onChange={(e) => setSecondaryName(e.target.value)} required />
        </div>

        <div className="flex items-center">
          <label className="block whitespace-nowrap min-w-60">Owner *</label>
          <Select
            className="w-full text-sm"
            options={owners?.data.data.map((owner) => ({ value: owner.id, label: owner.name }))}
            value={owner}
            onChange={(option) => setOwner(option)}
            placeholder="Select Owner"
            required
          />
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

        <div className="flex items-center">
          <label className="block whitespace-nowrap min-w-60">Price *</label>
          <div className="flex items-center w-full gap-4">
            <input
              type="number"
              className="input-text"
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (["e", "E", "+", "-"].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              value={price}
              onChange={(e) => {
                const value = e.target.value;
                if (+value < 0) return;
                setPrice(value);
              }}
              placeholder={currency?.label ? `Enter currency in ${currency?.label}` : "Select currency first"}
              disabled={!currency}
              required
            />

            <label className="block whitespace-nowrap">Discount</label>

            <input
              type="number"
              className="input-text"
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (["e", "E", "+", "-"].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              disabled={!currency}
              value={discount}
              onChange={(e) => {
                const value = e.target.value;
                if (+value > 100 || +value < 0) return;
                setDiscount(value);
              }}
              placeholder="e.g. 0%"
            />

            <label className="block whitespace-nowrap">Discounted Price</label>

            <input type="number" className="input-text" value={+price - +price * ((+discount || 0) / 100) || 0} readOnly />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="block whitespace-nowrap min-w-60">Ownership *</label>
          {(["freehold", "leasehold"] as const).map((ownership, index) => (
            <div key={index} className="flex items-center gap-2">
              <span>{ownership}</span>
              <input type="checkbox" className="accent-primary" checked={ownershipType.includes(ownership)} onChange={() => setOwnershipType(ownership)} />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <label className="block whitespace-nowrap min-w-60">Sold Status *</label>
          {(["Yes", "No"] as const).map((ownership, index) => (
            <div key={index} className="flex items-center gap-2">
              <span>{ownership}</span>
              <input type="checkbox" className="accent-primary" checked={soldStatus === (ownership === "Yes")} onChange={() => setSoldStatus(ownership === "Yes")} />
            </div>
          ))}
        </div>

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

        <div className="flex justify-end gap-4">
          <Button className="btn-primary" type="submit">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};
