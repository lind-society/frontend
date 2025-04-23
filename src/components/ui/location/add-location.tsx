import * as React from "react";

import { useGetApi, usePersistentData } from "../../../hooks";

import { FormField } from "./form-field";
import { PlaceNearbyItem } from "./place-nearby-item";
import { LocationSelector } from "./location-selector";

import { GoogleMaps, NumberInput, Button } from "../../../components";

import { FaPlus } from "react-icons/fa";

import { Coordinate, OptionType, PlaceNearby } from "../../../types";
import { LocationFormState, LocationPersistedType } from "./types";

interface LocationProps {
  persistedDataKey: string;
  onChange?: (hasChanges: boolean) => void;
}

export const AddLocation: React.FC<LocationProps> = ({ persistedDataKey, onChange }) => {
  // store data to session storage
  const useStore = usePersistentData<LocationPersistedType>(persistedDataKey);
  const { setData, data } = useStore();

  const [formState, setFormState] = React.useState<LocationFormState>({
    placeNearby: data.placeNearby || [],
    address: data.address || "",
    postalCode: data.postalCode || "",
    mapLink: data.mapLink || "",
    country: data.country || "",
    state: data.state || "",
    city: data.city || "",
    placeName: "",
    placeDistance: "",
  });

  const [selectedCountry, setSelectedCountry] = React.useState<OptionType | null>(formState.country ? { label: formState.country, value: formState.country } : null);
  const [selectedProvince, setSelectedProvince] = React.useState<OptionType | null>(formState.state ? { label: formState.state, value: formState.state } : null);
  const [selectedCity, setSelectedCity] = React.useState<OptionType | null>(formState.city ? { label: formState.city, value: formState.city } : null);

  const {
    data: respCoordinates,
    isLoading,
    error,
  } = useGetApi<Coordinate>({
    key: ["get-coordinates", formState.mapLink],
    url: "regions/coordinates",
    params: { shortUrl: formState.mapLink },
    enabled: !!formState.mapLink,
  });

  const handleInputChange = <T extends keyof LocationFormState>(field: T, value: LocationFormState[T]) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  React.useEffect(() => {
    if (!onChange) return;

    const requiredFields: Array<keyof LocationFormState> = ["address", "postalCode", "mapLink", "country", "state", "city", "placeNearby"];
    const isComplete = requiredFields.every((field) => {
      if (field === "country" || field === "state" || field === "city") {
        return formState[field] !== null;
      }
      if (field === "placeNearby") {
        return formState[field].length > 0;
      }
      return formState[field] !== "";
    });

    if (isComplete) {
      const dataToSave = {
        address: formState.address,
        postalCode: formState.postalCode,
        mapLink: formState.mapLink,
        country: selectedCountry?.label,
        state: selectedProvince?.label,
        city: selectedCity?.label,
        placeNearby: formState.placeNearby,
      };

      setData(dataToSave);
      onChange(false);
    } else {
      onChange(true);
    }
  }, [formState, selectedCity, selectedCountry, selectedProvince]);

  const addPlaceNearby = () => {
    if (!formState.placeName || !formState.placeDistance) return;

    const place: PlaceNearby = {
      name: formState.placeName,
      distance: Number(formState.placeDistance),
    };

    setFormState((prev) => ({ ...prev, placeNearby: [...prev.placeNearby, place], placeName: "", placeDistance: "" }));
  };

  const removePlaceNearby = (id: number) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    setFormState((prev) => ({
      ...prev,
      placeNearby: prev.placeNearby.filter((_, index) => index !== id),
    }));
  };

  return (
    <>
      <h2 className="heading">Location</h2>
      <div className="mt-6 space-y-6">
        <LocationSelector
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          selectedProvince={selectedProvince}
          setSelectedProvince={setSelectedProvince}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
        />

        <FormField label="Address" required>
          <input type="text" required className="input-text" placeholder="Jln. Soekarno Hatta No. 59" value={formState.address} onChange={(e) => handleInputChange("address", e.target.value)} />
        </FormField>

        <FormField label="Postal code" required>
          <input type="text" required className="input-text" placeholder="1234567" value={formState.postalCode} onChange={(e) => handleInputChange("postalCode", e.target.value)} />
        </FormField>

        <FormField label="Google Map Link" required>
          <input
            type="text"
            required
            className="input-text"
            placeholder="https://maps.app.goo.gl/aDuVPL5Z71jRMsjz5"
            value={formState.mapLink}
            onChange={(e) => handleInputChange("mapLink", e.target.value)}
          />
        </FormField>

        <FormField label="Map Link">
          {error && <span className="text-red-600">please input a correct map link</span>}
          {!isLoading && !!formState.mapLink && !error && <GoogleMaps lat={respCoordinates?.latitude || 0} lng={respCoordinates?.longitude || 0} />}
        </FormField>

        <div className="space-y-2">
          <h2 className="mt-8 heading">Nearest Place</h2>
          <div className="flex items-stretch w-full gap-2">
            <input
              type="text"
              placeholder={`Enter the name of the closest place from ${data.name || "property"}`}
              className="input-text"
              value={formState.placeName}
              onChange={(e) => handleInputChange("placeName", e.target.value)}
            />
            <NumberInput
              placeholder="Enter the distance in meters"
              className="input-text max-w-60"
              value={formState.placeDistance}
              onChange={(e) => handleInputChange("placeDistance", e.target.value)}
            />
            <Button type="button" className="flex items-center gap-2 btn-primary whitespace-nowrap" onClick={addPlaceNearby}>
              <FaPlus size={20} /> Add
            </Button>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {formState.placeNearby.map((place, index) => (
            <PlaceNearbyItem key={index} place={place} index={index} onRemove={removePlaceNearby} />
          ))}
        </div>
      </div>
    </>
  );
};
