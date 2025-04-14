import * as React from "react";
import { useGetApi, usePersistentData } from "../../../hooks";

import { FacilityItem } from "./facility-item";
import { AddFacilityModal } from "./facility-modal";

import { Button, ToastMessage } from "../../../components";

import { FaEdit, FaEye, FaPlus } from "react-icons/fa";

import { Facility, FeaturePersistedType } from "./types";
import { Data, Facilities, Payload } from "../../../types";

interface AddKeyFeaturesProps {
  persistedDataKey: string;
  editDataKey: string;
  onChange?: (hasChanges: boolean) => void;
}

export const EditKeyFeatures: React.FC<AddKeyFeaturesProps> = ({ persistedDataKey, editDataKey, onChange }) => {
  // store data to session storage
  const useStore = usePersistentData<FeaturePersistedType>(persistedDataKey);
  const useEdit = usePersistentData<FeaturePersistedType>(editDataKey);

  const { data: dataBeforeEdit } = useStore();
  const { setData, data: dataAfterEdit } = useEdit();

  const data = dataAfterEdit.facilities ? dataAfterEdit : dataBeforeEdit;

  const [facilities, setFacilities] = React.useState<Facility[]>([]);
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [editMode, setEditMode] = React.useState<boolean>(false);

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
  };

  const resetFacility = (id: string) => {
    setFacilities((prevFacilities) =>
      prevFacilities.map((facility) => (facility.id === id ? { ...facility, name: "", icon: { url: "", key: "" }, description: "", includeDescription: true } : facility))
    );
  };

  const updateFacilityField = (id: string, field: keyof Facility, value: string | boolean) => {
    setFacilities((prevFacilities) => prevFacilities.map((feature) => (feature.id === id ? { ...feature, [field]: value } : feature)));
  };

  const updateFacilityIcon = (id: string, key: string | null, url: string) => {
    setFacilities((prevFacilities) => prevFacilities.map((facility) => (facility.id === id ? { ...facility, icon: { url, key: key ?? "" } } : facility)));
  };

  const handleSubmitService = (e: React.MouseEvent) => {
    e.preventDefault();
    // Submit key features data here
    const formattedData = {
      facilities: facilities
        .filter((feature) => feature.description !== "")
        .map((feature) => ({
          id: feature.id,
          description: feature.includeDescription ? feature.description : "",
        })) as Facilities[],
    };

    setData(formattedData);
    ToastMessage({ message: "Success saving edit key features...", color: "#22c55e" });
    setTimeout(() => {
      window.location.reload();
    }, 200);
  };

  React.useEffect(() => {
    if (!onChange || !data.facilities) return;

    const hasChanges = facilities.length !== data.facilities.length || facilities.some((facility, index) => facility.description !== data.facilities?.[index]?.description);

    onChange(hasChanges);
  }, [facilities]);

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
              includeDescription: true,
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
              includeDescription: true,
            }))
        );
      }
    }
  }, [responseFacilities]);

  return (
    <>
      <div className="p-8 space-y-8 border rounded-b bg-light border-dark/30">
        <div className="flex items-center justify-between">
          <h2 className="heading">Key Features</h2>
          <div className="flex items-center gap-2">
            {editMode && availableFacilities?.length! > 0 && (
              <Button onClick={() => setModalVisible(true)} className="flex items-center gap-2 btn-primary">
                <FaPlus /> Add Key Features
              </Button>
            )}
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
        </div>
        <div className="relative">
          <div className={`absolute inset-0 ${editMode ? "-z-1" : "z-5"}`}></div>

          {facilities.map((facility) => (
            <FacilityItem key={facility.id} facility={facility} onUpdateField={updateFacilityField} onUpdateIcon={updateFacilityIcon} onReset={resetFacility} onDelete={deleteFacility} />
          ))}

          <div className={`justify-end gap-4 mt-8 ${editMode ? "flex" : "hidden"}`}>
            <Button className="btn-primary" onClick={handleSubmitService}>
              Save
            </Button>
          </div>
        </div>
      </div>

      <AddFacilityModal isVisible={modalVisible} onClose={() => setModalVisible(false)} availableFacilities={availableFacilities || []} onAddFacility={addFacility} />
    </>
  );
};
