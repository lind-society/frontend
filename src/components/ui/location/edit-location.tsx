import * as React from "react";

import { useGetApi, usePersistentData } from "../../../hooks";

import { FormField } from "./form-field";
import { PlaceNearbyItem } from "./place-nearby-item";

import { Button, GoogleMaps, ToastMessage, LocationSelector, NumberInput } from "../../../components";

import { FaEdit, FaEye, FaPlus } from "react-icons/fa";

import { Coordinate, OptionType } from "../../../types";
import { LocationFormState, LocationPersistedType } from "./types";

interface LocationProps {
  persistedDataKey: string;
  editDataKey: string;
  onChange?: (hasChanges: boolean) => void;
}

const arraysEqual = (a: string, b: string) => {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

export const EditLocation: React.FC<LocationProps> = ({ persistedDataKey, editDataKey, onChange }) => {
  // Store data to session storage
  const useStore = usePersistentData<LocationPersistedType>(persistedDataKey);
  const useEdit = usePersistentData<LocationPersistedType>(editDataKey);

  const { data: dataBeforeEdit } = useStore();
  const { setData, data: dataAfterEdit } = useEdit();

  const dataCondition = !!(
    dataAfterEdit.placeNearby ||
    dataAfterEdit.country ||
    dataAfterEdit.state ||
    dataAfterEdit.city ||
    dataAfterEdit.address ||
    dataAfterEdit.mapLink ||
    dataAfterEdit.postalCode
  );

  const data = React.useMemo(() => {
    return dataCondition ? dataAfterEdit : dataBeforeEdit;
  }, [dataAfterEdit, dataBeforeEdit]);

  const [editMode, setEditMode] = React.useState<boolean>(false);

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

  const updateFormState = (field: keyof LocationFormState, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const addPlaceNearby = () => {
    if (!formState.placeName || !formState.placeDistance) return;

    const updatedPlaces = [...formState.placeNearby, { name: formState.placeName, distance: +formState.placeDistance }];

    updateFormState("placeNearby", updatedPlaces);
    setFormState((prev) => ({
      ...prev,
      placeName: "",
      placeDistance: "",
    }));
  };

  const removePlaceNearby = (id: number) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    const updatedPlaceNearby = formState.placeNearby.filter((_, index) => index !== id);
    updateFormState("placeNearby", updatedPlaceNearby);
  };

  const handleSubmitLocation = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedData = {
      address: formState.address,
      postalCode: formState.postalCode,
      mapLink: formState.mapLink,
      country: selectedCountry?.label,
      state: selectedProvince?.label,
      city: selectedCity?.label,
      placeNearby: formState.placeNearby,
    };

    setData(formattedData);

    ToastMessage({ message: "Success saving edit location...", color: "#22c55e" });

    setTimeout(() => {
      window.location.reload();
    }, 200);
  };

  React.useEffect(() => {
    if (!onChange || !data.placeNearby) return;

    const placeNearbyEqual = formState.placeNearby.length === data.placeNearby.length;

    const hasChanges =
      !arraysEqual(selectedCountry?.label || "", data.country || "") ||
      !arraysEqual(selectedProvince?.label || "", data.state || "") ||
      !arraysEqual(selectedCity?.label || "", data.city || "") ||
      !arraysEqual(formState.address, data.address || "") ||
      !arraysEqual(formState.mapLink, data.mapLink || "") ||
      !arraysEqual(formState.postalCode, data.postalCode || "") ||
      !placeNearbyEqual;

    onChange(hasChanges);
  }, [formState, selectedCity, selectedProvince, selectedCountry]);

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="heading">Location</h2>
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

      <form className="relative space-y-8" onSubmit={handleSubmitLocation}>
        <div className={`absolute inset-0 ${editMode ? "-z-1" : "z-5"}`}></div>

        <LocationSelector
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          selectedProvince={selectedProvince}
          setSelectedProvince={setSelectedProvince}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
        />

        <FormField label="Address" required>
          <input type="text" required className="input-text" placeholder="Jln. Soekarno Hatta No. 59" value={formState.address} onChange={(e) => updateFormState("address", e.target.value)} />
        </FormField>

        <FormField label="Postal code" required>
          <input type="text" required className="input-text" placeholder="1234567" value={formState.postalCode} onChange={(e) => updateFormState("postalCode", e.target.value)} />
        </FormField>

        <FormField label="Google Map Link" required>
          <input
            type="text"
            required
            className="input-text"
            placeholder="https://maps.app.goo.gl/aDuVPL5Z71jRMsjz5"
            value={formState.mapLink}
            onChange={(e) => updateFormState("mapLink", e.target.value)}
          />
        </FormField>

        <FormField label="Map Link">{!isLoading && !!formState.mapLink && !error && <GoogleMaps lat={respCoordinates?.latitude || 0} lng={respCoordinates?.longitude || 0} />}</FormField>

        <div className="space-y-2">
          <h2 className="mt-8 heading">Nearest Place</h2>
          <div className="flex items-stretch w-full gap-2">
            <input
              type="text"
              placeholder={`Enter the name of the closest place from ${data.name || "property"}`}
              className="input-text"
              value={formState.placeName}
              onChange={(e) => setFormState((prev) => ({ ...prev, placeName: e.target.value }))}
            />
            <NumberInput
              placeholder="Enter the distance in meters"
              className="input-text max-w-60"
              value={formState.placeDistance}
              onChange={(e) => setFormState((prev) => ({ ...prev, placeDistance: e.target.value }))}
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

        <div className={`justify-end gap-4 mt-8 ${editMode ? "flex" : "hidden"}`}>
          <Button className="btn-primary" type="submit">
            Save
          </Button>
        </div>
      </form>
    </>
  );
};
