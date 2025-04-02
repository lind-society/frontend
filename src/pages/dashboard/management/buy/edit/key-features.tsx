import * as React from "react";

import { useGetApi, usePersistentData } from "../../../../../hooks";

import { Button, Modal, ToastMessage } from "../../../../../components";

import IconifyPicker from "@zunicornshift/mui-iconify-picker";

import { GrPowerReset } from "react-icons/gr";
import { IoClose } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";

import { Data, Payload, Property } from "../../../../../types";

interface Facilities {
  id: string;
  icon: { url: string; key: string };
  name: string;
  description: string;
  includeDescription: boolean;
}

export const KeyFeatures = () => {
  // store data to session storage
  const useStore = usePersistentData<Property>("get-property");
  const useEdit = usePersistentData<Property>("edit-property");

  const { data: dataBeforeEdit } = useStore();
  const { setData, data: dataAfterEdit } = useEdit();

  const data = dataAfterEdit.facilities ? dataAfterEdit : dataBeforeEdit;

  const [facilities, setFacilities] = React.useState<Facilities[]>([]);
  const [idIcon, setIdIcon] = React.useState<string>();
  const [modalFeature, setModalFeature] = React.useState<boolean>(false);

  const { data: responseFacilities } = useGetApi<Payload<Data<Property["facilities"]>>>({ key: ["facilities"], url: "facilities", params: { limit: "20" } });

  // const addFacility = () => {
  //   setFacilities((prevFacilities) => [{ id: crypto.randomUUID(), name: "", icon: { url: "", key: "" }, description: "", includeDescription: true }, ...prevFacilities]);
  //   setModalFeature(false);
  // };

  const addOtherFacility = (facilityId: string, name: string, icon: Facilities["icon"]) => {
    setFacilities((prevFacilities) => [{ id: facilityId, name, icon, description: "", includeDescription: true }, ...prevFacilities]);
    setModalFeature(false);
  };

  const deleteFacility = (id: string) => {
    setFacilities((prevFacilities) => prevFacilities.filter((facility) => facility.id !== id));
  };

  const resetFacilities = (id: string) => {
    setFacilities((prevFacilities) =>
      prevFacilities.map((facility) => (facility.id === id ? { ...facility, name: "", icon: { url: "", key: "" }, description: "", includeDescription: true } : facility))
    );
  };

  const updateFacility = (id: string, field: keyof Facilities, value: string | boolean) => {
    setFacilities((prevFacilities) => prevFacilities.map((feature) => (feature.id === id ? { ...feature, [field]: value } : feature)));
  };

  const updateFacilityIcon = (key: string | null, e: React.MouseEvent<HTMLElement>) => {
    const url = (e.target as HTMLImageElement).src;
    setFacilities((prevFacilities) => prevFacilities.map((feature) => (feature.id === idIcon ? { ...feature, icon: { url, key: key ?? "" } } : feature)));
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
        })) as Property["facilities"],
    };

    setData(formattedData);
    ToastMessage({ message: "Success saving key features", color: "#22c55e" });
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

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
            .map((facility) => ({ id: facility.id, name: facility.name, icon: facility.icon, description: "", includeDescription: true }))
        );
      }
    }
  }, [responseFacilities]);

  return (
    <>
      <div className="p-8 space-y-8 border rounded-b bg-light border-dark/30">
        <div className="flex items-center justify-between">
          <h2 className="heading">Key Features</h2>
          <Button onClick={() => setModalFeature(true)} className="flex items-center gap-2 btn-primary">
            <FaPlus /> Add Key Features
          </Button>
        </div>
        {facilities.map((facility) => (
          <div key={facility.id} className="flex items-center gap-4 p-4 mt-4 border-b border-dark/30">
            <div className="space-y-2">
              <label className="block text-sm whitespace-nowrap">Icon *</label>
              <div onClick={() => setIdIcon(facility.id)}>
                <IconifyPicker onChange={updateFacilityIcon} value={facility.icon.key} />
              </div>
            </div>
            <div className="w-full space-y-1 ms-2">
              <label className="block text-sm">Title *</label>
              <input type="text" placeholder="Title" className="input-text" value={facility.name} onChange={(e) => updateFacility(facility.id, "name", e.target.value)} />
            </div>
            <div className="space-y-0.5 mx-8">
              <label className="block text-sm whitespace-nowrap">Include Description *</label>
              <div className="flex items-center gap-8 py-2">
                <label className="flex items-center gap-2">
                  Yes
                  <input
                    type="checkbox"
                    name={`desc-${facility.id}`}
                    checked={facility.includeDescription}
                    onChange={() => updateFacility(facility.id, "includeDescription", true)}
                    className="accent-primary size-4"
                  />
                </label>
                <label className="flex items-center gap-2">
                  No
                  <input
                    type="checkbox"
                    name={`desc-${facility.id}`}
                    checked={!facility.includeDescription}
                    onChange={() => {
                      updateFacility(facility.id, "includeDescription", false);
                    }}
                    className="accent-primary size-4"
                  />
                </label>
              </div>
            </div>
            <div className="w-full space-y-1 max-w-60">
              <label className="block text-sm">Description *</label>
              <input
                type="text"
                placeholder="Description"
                className="input-text"
                value={facility.description}
                onChange={(e) => updateFacility(facility.id, "description", e.target.value)}
                disabled={!facility.includeDescription}
              />
            </div>
            <div className="mx-8">
              <label className="block text-sm opacity-0">Action</label>
              <div className="flex items-center gap-8">
                <button onClick={() => resetFacilities(facility.id)}>
                  <GrPowerReset size={22} />
                </button>
                <button onClick={() => deleteFacility(facility.id)}>
                  <IoClose size={28} />
                </button>
              </div>
            </div>
          </div>
        ))}
        <div className="flex justify-end gap-4">
          {/* <Button className="btn-outline">Reset</Button> */}
          <Button className="btn-primary" onClick={handleSubmitService}>
            Save
          </Button>
        </div>
      </div>
      <Modal isVisible={modalFeature} onClose={() => setModalFeature(false)}>
        <h2 className="text-lg font-bold">Add Key Features</h2>
        <div className="mt-4 overflow-y-auto border border-dark/30">
          {responseFacilities?.data.data
            .filter((facility) => facility.type === "optional")
            .filter((facility) => !facilities.some((item) => item.name === facility.name))
            .map((facility, index) => (
              <div key={index} className="flex items-center justify-between p-2 border-b border-dark/30">
                <span>{facility.name}</span>
                <Button onClick={() => addOtherFacility(facility.id, facility.name, facility.icon)} className="btn-outline">
                  <FaPlus />
                </Button>
              </div>
            ))}
        </div>
        {/* <div className="flex items-center w-full my-6">
          <div className="flex-grow h-px bg-dark/30"></div>
          <span className="flex-shrink-0 px-3 text-sm text-dark">or</span>
          <div className="flex-grow h-px bg-dark/30"></div>
        </div> */}
        {/* <Button onClick={addFacility} className="flex items-center justify-center w-full gap-2 btn-primary">
          <FaPlus /> Add new key feature
        </Button> */}
      </Modal>
    </>
  );
};
