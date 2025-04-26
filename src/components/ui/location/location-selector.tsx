import axios from "axios";

import { useQuery } from "@tanstack/react-query";

import Select from "react-select";

import { LocationSelectorProps } from "../../../types";
import { API_URL } from "../../../utils/api";

const GC_TIME = 3 * 60 * 60 * 1000;
const STALE_TIME = 2 * 60 * 60 * 1000;

const fetchCountries = async () => {
  const { data } = await axios.get(`${API_URL}/regions/countries`);
  return data.map((c: any) => ({ value: c.id, label: c.name }));
};

const fetchProvinces = async (countryId: string) => {
  const { data } = await axios.get(`${API_URL}/regions/provinces?countryId=${countryId}`);
  return data.map((p: any) => ({ value: p.id, label: p.name }));
};

const fetchCities = async (country: string, provinceId: string) => {
  const { data } = await axios.get(`${API_URL}/regions/cities?countryId=${country}&provinceId=${provinceId}`);
  return data.map((c: any) => ({ value: c.id, label: c.name }));
};

export const LocationSelector = ({ selectedCity, selectedCountry, selectedProvince, setSelectedCity, setSelectedCountry, setSelectedProvince }: LocationSelectorProps) => {
  const { data: countries = [] } = useQuery({ queryKey: ["countries"], queryFn: fetchCountries, gcTime: GC_TIME, staleTime: STALE_TIME });
  const { data: provinces = [], refetch: refetchProvinces } = useQuery({
    queryKey: ["provinces", selectedCountry?.value],
    queryFn: () => fetchProvinces(selectedCountry!.value),
    gcTime: GC_TIME,
    staleTime: STALE_TIME,
    enabled: !!selectedCountry,
  });
  const { data: cities = [], refetch: refetchCities } = useQuery({
    queryKey: ["cities", selectedCountry?.label, selectedProvince?.value],
    queryFn: () => fetchCities(selectedCountry!.label, selectedProvince!.value),
    gcTime: GC_TIME,
    staleTime: STALE_TIME,
    enabled: !!selectedCountry && !!selectedProvince,
  });

  return (
    <>
      <div className="flex items-center">
        <label className="block whitespace-nowrap min-w-60">Country *</label>
        <Select
          isClearable
          required
          className="w-full"
          options={countries}
          value={selectedCountry}
          onChange={(option) => {
            setSelectedCountry(option);
            setSelectedProvince(null);
            setSelectedCity(null);
            refetchProvinces();
          }}
          placeholder="Select Country"
        />
      </div>

      <div className="flex items-center">
        <label className="block whitespace-nowrap min-w-60">Province *</label>
        <Select
          isClearable
          required
          className="w-full"
          options={provinces}
          value={selectedProvince}
          onChange={(option) => {
            setSelectedProvince(option);
            setSelectedCity(null);
            refetchCities();
          }}
          placeholder="Select Province"
          isDisabled={!selectedCountry}
        />
      </div>

      <div className="flex items-center">
        <label className="block whitespace-nowrap min-w-60">City *</label>
        <Select isClearable required className="w-full" options={cities} value={selectedCity} onChange={(option) => setSelectedCity(option)} placeholder="Select City" isDisabled={!selectedProvince} />
      </div>
    </>
  );
};
