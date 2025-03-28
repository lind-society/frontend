import * as React from "react";

import axios from "axios";

import { usePersistentData } from "../../../../../hooks";

import { Button, Modal, GoogleMaps, ToastMessage } from "../../../../../components";

import Select from "react-select";

import { IoMdSearch } from "react-icons/io";
import { FaMinus, FaPlus } from "react-icons/fa";

import { Villa } from "../../../../../types";
import { baseApiURL } from "../../../../../static";

interface OptionType {
  value: string;
  label: string;
}

interface LocationSelectorProps {
  selectedCountry: OptionType | null;
  selectedProvince: OptionType | null;
  selectedCity: OptionType | null;
  setSelectedCountry: (value: OptionType | null) => void;
  setSelectedProvince: (value: OptionType | null) => void;
  setSelectedCity: (value: OptionType | null) => void;
}

interface PlaceNearby {
  name: string;
  distance: number;
}

const placeNearbyDefault: PlaceNearby[] = [
  { name: "Kuta", distance: 100 },
  { name: "Ubud", distance: 200 },
  { name: "Seminyak", distance: 150 },
  { name: "Canggu", distance: 180 },
  { name: "Nusa Dua", distance: 250 },
];

const LocationSelector = ({ selectedCity, selectedCountry, selectedProvince, setSelectedCity, setSelectedCountry, setSelectedProvince }: LocationSelectorProps) => {
  const [countries, setCountries] = React.useState<OptionType[]>([]);
  const [provinces, setProvinces] = React.useState<OptionType[]>([]);
  const [cities, setCities] = React.useState<OptionType[]>([]);

  // Fetch Countries
  React.useEffect(() => {
    axios.get(`${baseApiURL}/regions/countries`).then((res) => {
      const countryList = res.data.map((c: any) => ({ value: c.id, label: c.name }));
      setCountries(countryList);
    });
  }, []);

  // Fetch Provinces when Country is selected
  React.useEffect(() => {
    if (selectedCountry) {
      axios.get(`${baseApiURL}/regions/provinces?countryId=${selectedCountry.value}`).then((res) => {
        const provinceOptions = res.data.map((p: any) => ({ value: p.id, label: p.name }));
        setProvinces(provinceOptions);
        setSelectedProvince(null);
        setCities([]);
      });
    }
  }, [selectedCountry]);

  // Fetch Cities when Province is selected
  React.useEffect(() => {
    if (selectedCountry && selectedProvince) {
      axios.get(`${baseApiURL}/regions/cities?country=${selectedCountry.label}&province=${selectedProvince.value}`).then((res) => {
        const cityOptions = res.data.map((c: any) => ({ value: c.id, label: c.name }));
        setCities(cityOptions);
        setSelectedCity(null);
      });
    }
  }, [selectedCountry, selectedProvince]);

  return (
    <>
      {/* Country Select */}
      <div className="flex items-center">
        <label className="block whitespace-nowrap min-w-60">Country *</label>
        <Select isClearable required className="w-full" options={countries} value={selectedCountry} onChange={(option) => setSelectedCountry(option)} placeholder="Select Country" />
      </div>

      {/* Province Select */}
      <div className="flex items-center">
        <label className="block whitespace-nowrap min-w-60">Province *</label>
        <Select
          isClearable
          required
          className="w-full"
          options={provinces}
          value={selectedProvince}
          onChange={(option) => setSelectedProvince(option)}
          placeholder="Select Province"
          isDisabled={!selectedCountry}
        />
      </div>

      {/* City Select */}
      <div className="flex items-center">
        <label className="block whitespace-nowrap min-w-60">City *</label>
        <Select isClearable required className="w-full" options={cities} value={selectedCity} onChange={(option) => setSelectedCity(option)} placeholder="Select City" isDisabled={!selectedProvince} />
      </div>
    </>
  );
};

export const Location = () => {
  const useStore = usePersistentData<Partial<Villa>>("add-villa");
  const { setData, data } = useStore();

  const [modalInput, setModalInput] = React.useState<boolean>(false);

  const defaultCountry = data.country ? { label: data.country, value: data.country } : null;
  const defaultState = data.state ? { label: data.state, value: data.state } : null;
  const defaultCity = data.city ? { label: data.city, value: data.city } : null;

  const [placeNearby, setPlaceNearby] = React.useState<PlaceNearby[]>(data.placeNearby || [{ name: "Uluwatu", distance: 300 }]);
  const [address, setAddress] = React.useState<string>(data.address || "");
  const [postalCode, setPostalCode] = React.useState<string>(data.postalCode || "");
  const [mapLink, setMapLink] = React.useState<string>(data.mapLink || "");
  const [selectedCountry, setSelectedCountry] = React.useState<OptionType | null>(defaultCountry);
  const [selectedProvince, setSelectedProvince] = React.useState<OptionType | null>(defaultState);
  const [selectedCity, setSelectedCity] = React.useState<OptionType | null>(defaultCity);

  const addPlaceNearby = (name: string, distance: number) => {
    setPlaceNearby([...placeNearby, { name, distance }]);
    setModalInput(false);
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
    }, 1000);
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

        {/* Location name */}
        <div className="flex items-center">
          <label className="block whitespace-nowrap min-w-60">Address *</label>
          <input type="text" required className="input-text" placeholder="Jln. Soekarno Hatta No. 59" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>

        {/* Postal code */}
        <div className="flex items-center">
          <label className="block whitespace-nowrap min-w-60">Postal code *</label>
          <input type="text" required className="input-text" placeholder="1234567" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
        </div>

        {/* Google Map Link */}
        <div className="flex items-center">
          <label className="block whitespace-nowrap min-w-60">Google Map Link *</label>
          <input type="text" required className="input-text" placeholder="https://maps.app.goo.gl/aDuVPL5Z71jRMsjz5" value={mapLink} onChange={(e) => setMapLink(e.target.value)} />
        </div>

        <div className="flex items-center">
          <label className="block opacity-0 whitespace-nowrap min-w-60">Map Link</label>

          <GoogleMaps />
        </div>

        {/* Nearest Place */}
        <h2 className="mt-8 heading">Nearest Place</h2>
        <div className="flex items-stretch w-full mt-4 overflow-hidden border rounded border-dark/30">
          <input type="text" placeholder="Search place" className="flex-1 px-4 py-2 text-dark placeholder-dark/30 focus:outline-none" onClick={() => setModalInput(true)} readOnly />
          <button className="flex items-center justify-center h-10 text-light bg-primary w-14">
            <IoMdSearch size={25} />
          </button>
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

        {/* Save and Cancel Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <Button type="button" className="btn-outline">
            Reset
          </Button>
          <Button type="submit" className="btn-primary">
            Save
          </Button>
        </div>
      </form>

      <Modal isVisible={modalInput} onClose={() => setModalInput(false)}>
        <div className="flex items-stretch w-full mt-4 overflow-hidden border rounded border-dark/30">
          <input type="text" placeholder="Search place" className="flex-1 px-4 py-2 text-dark placeholder-dark/30 focus:outline-none" />
          <button type="button" className="flex items-center justify-center h-10 text-light bg-primary w-14">
            <IoMdSearch size={25} />
          </button>
        </div>
        <div className="mt-6 space-y-4">
          {placeNearbyDefault
            .filter((place) => !placeNearby.some((f) => f.name === place.name))
            .map((place, index) => (
              <span key={index} className="flex items-center justify-between w-full px-8 pb-4 border-b border-dark/30">
                <p>{place.name}</p>
                <p className="flex items-center gap-8">
                  {place.distance} m
                  <button type="button" onClick={() => addPlaceNearby(place.name, place.distance)}>
                    <FaPlus size={24} />
                  </button>
                </p>
              </span>
            ))}
        </div>
      </Modal>
    </div>
  );
};
