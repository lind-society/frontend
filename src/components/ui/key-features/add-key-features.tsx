import * as React from "react";
import { useGetApi, usePersistentData } from "../../../hooks";

import { FacilityItem } from "./facility-item";
import { AddFacilityModal } from "./facility-modal";

import { Button } from "../../../components";

import { FaPlus } from "react-icons/fa";

import { Facility, FeaturePersistedType } from "./types";
import { Data, Facilities, Payload } from "../../../types";

interface KeyFeaturesProps {
  persistedDataKey: string;
  onChange?: (hasChanges: boolean) => void;
}

export const AddKeyFeaturesTab: React.FC<KeyFeaturesProps> = ({ persistedDataKey, onChange }) => {
  const useStore = usePersistentData<Partial<FeaturePersistedType>>(persistedDataKey);
  const { setData, data } = useStore();

  const [facilities, setFacilities] = React.useState<Facility[]>([]);
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);

  const [shouldSave, setShouldSave] = React.useState<boolean>(false);

  const { data: responseFacilities } = useGetApi<Payload<Data<Facilities[]>>>({
    key: ["facilities"],
    url: "facilities",
    params: { limit: "20" },
  });

  const availableFacilities = React.useMemo(() => {
    return responseFacilities?.data.data.filter((facility) => !facilities.some((item) => item.name === facility.name));
  }, [responseFacilities?.data.data, facilities]);

  const addFacility = (facilityId: string, name: string, icon: Facility["icon"]) => {
    setFacilities((prevFacilities) => [{ id: facilityId, name, icon, description: "", includeDescription: true }, ...prevFacilities]);

    if (availableFacilities?.length! <= 1) {
      setModalVisible(false);
    }
  };

  const deleteFacility = (id: string) => {
    if (!window.confirm("Are you sure want to remove this facility?")) return;

    setFacilities((prevFacilities) => prevFacilities.filter((facility) => facility.id !== id));
    setShouldSave(true);
  };

  const resetFacility = (id: string) => {
    setFacilities((prevFacilities) =>
      prevFacilities.map((facility) => (facility.id === id ? { ...facility, name: "", icon: { url: "", key: "" }, description: "", includeDescription: true } : facility))
    );
    setShouldSave(true);
  };

  const updateFacilityField = (id: string, field: keyof Facility, value: string | boolean) => {
    if (field === "description") {
      setShouldSave(true);
    }
    setFacilities((prevFacilities) => prevFacilities.map((feature) => (feature.id === id ? { ...feature, [field]: value } : feature)));
  };

  const updateFacilityIcon = (id: string, key: string | null, url: string) => {
    setFacilities((prevFacilities) => prevFacilities.map((facility) => (facility.id === id ? { ...facility, icon: { url, key: key ?? "" } } : facility)));
  };

  React.useEffect(() => {
    if (!onChange) return;
    const isDescriptionField = facilities.some((facility) => facility.includeDescription && facility.description.trim() !== "");
    const isDescriptionNotField = facilities.some((facility) => facility.includeDescription === false);

    const isComplete = isDescriptionField || isDescriptionNotField;

    if (isComplete) {
      const dataToSave = {
        facilities: facilities.map((feature) => ({ id: feature.id, description: feature.description })) as Facilities[],
      };

      setData(dataToSave);
      onChange(false);
    } else {
      onChange(true);
    }
  }, [facilities, shouldSave]);

  React.useEffect(() => {
    if (responseFacilities) {
      if (data.facilities) {
        setFacilities(
          responseFacilities.data.data
            .filter((facility) => data.facilities?.some((item) => item.id === facility.id))
            .map((facility) => ({
              id: facility.id,
              name: facility.name,
              icon: facility.icon,
              description: data.facilities?.find((item) => item.id === facility.id)?.description || "",
              includeDescription: data.facilities?.find((item) => item.id === facility.id)?.description === "" ? false : true,
            }))
        );
      } else {
        setFacilities(
          responseFacilities.data.data
            .filter((facility) => facility.type === "main")
            .map((facility) => ({
              id: facility.id,
              name: facility.name,
              icon: facility.icon,
              description: "",
              includeDescription: facility.description !== "" ? false : true,
            }))
        );
      }
    }
  }, [responseFacilities]);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="heading">Key Features</h2>
        {availableFacilities?.length! > 0 && (
          <Button onClick={() => setModalVisible(true)} className="flex items-center gap-2 btn-primary">
            <FaPlus /> Add Key Features
          </Button>
        )}
      </div>

      {facilities.map((facility) => (
        <FacilityItem key={facility.id} facility={facility} onUpdateField={updateFacilityField} onUpdateIcon={updateFacilityIcon} onReset={resetFacility} onDelete={deleteFacility} />
      ))}

      <AddFacilityModal isVisible={modalVisible} onClose={() => setModalVisible(false)} availableFacilities={availableFacilities || []} onAddFacility={addFacility} />
    </>
  );
};
