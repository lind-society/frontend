import * as React from "react";

import axios from "axios";

import Select from "react-select";

import { baseApiURL } from "../static";

import { LocationSelectorProps, OptionType } from "../types";

export const LocationSelector = ({ selectedCity, selectedCountry, selectedProvince, setSelectedCity, setSelectedCountry, setSelectedProvince }: LocationSelectorProps) => {
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
