import * as React from "react";

import { usePersistentData } from "../../../../../hooks";

import { Button, GoogleMaps, ToastMessage, LocationSelector, NumberInput } from "../../../../../components";

import { FaMinus, FaPlus } from "react-icons/fa";

import { OptionType, Property } from "../../../../../types";

interface PlaceNearby {
  name: string;
  distance: number;
}

export const Location = () => {
  const useStore = usePersistentData<Partial<Property>>("add-property");
  const { setData, data } = useStore();

  const defaultCountry = data.country ? { label: data.country, value: data.country } : null;
  const defaultState = data.state ? { label: data.state, value: data.state } : null;
  const defaultCity = data.city ? { label: data.city, value: data.city } : null;

  const [placeName, setPlaceName] = React.useState<string>("");
  const [placeDistance, setPlaceDistance] = React.useState<string>("");
  const [placeNearby, setPlaceNearby] = React.useState<PlaceNearby[]>(data.placeNearby || []);
  const [address, setAddress] = React.useState<string>(data.address || "");
  const [postalCode, setPostalCode] = React.useState<string>(data.postalCode || "");
  const [mapLink, setMapLink] = React.useState<string>(data.mapLink || "");
  const [selectedCountry, setSelectedCountry] = React.useState<OptionType | null>(defaultCountry);
  const [selectedProvince, setSelectedProvince] = React.useState<OptionType | null>(defaultState);
  const [selectedCity, setSelectedCity] = React.useState<OptionType | null>(defaultCity);

  const addPlaceNearby = (name: string, distance: number) => {
    setPlaceNearby((prev) => [...prev, { name, distance }]);
    setPlaceName("");
    setPlaceDistance("");
  };

  const removePlaceNearby = (id: number) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    const updatedPlaceNearby = placeNearby.filter((_, index) => index !== id);
    setPlaceNearby(updatedPlaceNearby);
  };

  const handleSubmitLocation = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit location data here
    const formattedData = { address, postalCode, mapLink, country: selectedCountry?.label, state: selectedProvince?.label, city: selectedCity?.label, placeNearby };
    setData(formattedData);
    ToastMessage({ message: "Success saving location", color: "#22c55e" });
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div className="p-8 border rounded-b bg-light border-dark/30">
      <h2 className="heading">Location</h2>
      <form className="mt-6 space-y-6" onSubmit={handleSubmitLocation}>
        <LocationSelector
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          selectedProvince={selectedProvince}
          setSelectedProvince={setSelectedProvince}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
        />

        <div className="flex items-center">
          <label className="block whitespace-nowrap min-w-60">Address *</label>
          <input type="text" required className="input-text" placeholder="Jln. Soekarno Hatta No. 59" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>

        <div className="flex items-center">
          <label className="block whitespace-nowrap min-w-60">Postal code *</label>
          <input type="text" required className="input-text" placeholder="1234567" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
        </div>

        <div className="flex items-center">
          <label className="block whitespace-nowrap min-w-60">Google Map Link *</label>
          <input type="text" required className="input-text" placeholder="https://maps.app.goo.gl/aDuVPL5Z71jRMsjz5" value={mapLink} onChange={(e) => setMapLink(e.target.value)} />
        </div>

        <div className="flex items-center">
          <label className="block opacity-0 whitespace-nowrap min-w-60">Map Link</label>

          <GoogleMaps />
        </div>

        <div className="space-y-2">
          <h2 className="mt-8 heading">Nearest Place</h2>
          <div className="flex items-stretch w-full gap-2">
            <input
              type="text"
              placeholder={`Enter the name of the closest place from ${data.name || "property"}`}
              className="input-text"
              value={placeName}
              onChange={(e) => setPlaceName(e.target.value)}
            />
            <NumberInput placeholder="Enter the distance in meters" className="input-text max-w-60" value={placeDistance} onChange={(e) => setPlaceDistance(e.target.value)} />
            <Button type="button" className="flex items-center gap-2 btn-primary whitespace-nowrap" onClick={() => addPlaceNearby(placeName, +placeDistance)}>
              <FaPlus size={20} /> Add
            </Button>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {placeNearby.map((item, index) => (
            <span key={index} className="flex items-center justify-between w-full px-4 pb-4">
              <p>{item.name}</p>
              <p className="flex items-center gap-8">
                {item.distance} m
                <button type="button" onClick={() => removePlaceNearby(index)}>
                  <FaMinus size={24} />
                </button>
              </p>
            </span>
          ))}
        </div>

        <div className="flex justify-end gap-4 mt-8">
          {/* <Button type="button" className="btn-outline">
            Reset
          </Button> */}
          <Button type="submit" className="btn-primary">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};
