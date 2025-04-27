import * as React from "react";

import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useGetApi, usePersistentData, useUpdateApi } from "../../../../../hooks";

import { EditKeyFeaturesTab, EditLocationTab, EditMediaTab, EditServiceFeaturesTab, Layout } from "../../../../../components/ui";

import { Button } from "../../../../../components";

import { FaArrowLeft, FaUpload } from "react-icons/fa";

import { GeneralTab } from "./general";
import { ReviewTab } from "./review";
import { VillaPoliciesTab } from "./villa-policies";
import { RentManagementTab } from "./rent-management";

import { Payload, Villa } from "../../../../../types";

import { deleteKeysObject } from "../../../../../utils";

const tabs = ["Rent Management", "General", "Media", "Location", "Key Features", "Service & Features", "Villa Policies", "Review"];

export const EditHomeVillaPage = () => {
  const { pathname } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const { mutate: editVilla, isPending } = useUpdateApi<Partial<Villa>>({ key: ["editing-villa"], url: "/villas", redirectPath: `/dashboard/management/home-villa/edit/${id}` });

  const { data: responseVilla, isLoading } = useGetApi<Payload<Villa>>({ url: `villas/${id}`, key: ["get-villa", id] });

  const useStore = usePersistentData<Villa>("get-villa");
  const useEdit = usePersistentData<Villa>("edit-villa");

  const { setData } = useStore();
  const { data } = useEdit();

  const [activeTab, setActiveTab] = React.useState<string>(() => {
    return sessionStorage.getItem("activeTab") || "Rent Management";
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState<boolean>(false);
  const [isWaiting, setIsWaiting] = React.useState<boolean>(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsWaiting(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (pathname === `/dashboard/management/home-villa/edit/${id}`) {
      sessionStorage.setItem("activeTab", activeTab);
    }

    return () => {
      sessionStorage.removeItem("activeTab");
    };
  }, [pathname, activeTab]);

  React.useEffect(() => {
    if (responseVilla) {
      const { data: responseData } = responseVilla;

      setData({
        ...responseData,
        facilities: responseData.facilities.map((facility) => ({
          id: facility.id,
          description: facility.description,
        })) as Villa["facilities"],
      });
    }
  }, [responseVilla]);

  const handleNavigateAway = (tab: string) => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm("You have unsaved changes. Are you sure you want to leave?");
      if (!confirmLeave) {
        return;
      }
    }
    setActiveTab(tab);
  };

  const handlePublish = (e: React.MouseEvent) => {
    e.preventDefault();
    const processData = deleteKeysObject(data, ["currency", "pivotId", "facilities", "priceAfterDiscount", "createdAt", "updatedAt", "id", "reviews"]);
    editVilla({ updatedItem: processData, id: id || "" });
  };

  return (
    <Layout>
      <header className="flex items-center justify-between pb-4 mb-6 border-b border-dark/30">
        <div className="flex items-center gap-4">
          <Button className="btn-primary" onClick={() => navigate(-1)}>
            <FaArrowLeft size={20} />
          </Button>
          <h1 className="head-title">{responseVilla?.data.name}</h1>
        </div>

        <div className="flex items-center gap-4">
          <Button onClick={handlePublish} className="btn-primary">
            {isPending ? (
              <div className="loader size-4 after:size-4"></div>
            ) : (
              <div className="flex items-center gap-2">
                <FaUpload /> Publish
              </div>
            )}
          </Button>
        </div>
      </header>

      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-1.5 border border-dark/30 rounded-t-md ${activeTab === tab ? "bg-primary text-light" : "bg-light text-primary"}`}
            onClick={() => handleNavigateAway(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="relative p-8 border rounded-b bg-light border-dark/30 min-h-600">
        {activeTab === "Rent Management" && <RentManagementTab />}
        {activeTab === "Review" && <ReviewTab />}
        {isLoading || isWaiting ? (
          <div className="flex items-center justify-center min-h-400">
            <div className="loader size-10 after:size-10"></div>
          </div>
        ) : (
          <>
            {activeTab === "General" && (
              <GeneralTab
                onChange={(hasChanges: boolean) => {
                  setHasUnsavedChanges(hasChanges);
                }}
              />
            )}
            {activeTab === "Media" && (
              <EditMediaTab
                persistedDataKey="get-villa"
                editDataKey="edit-villa"
                type="villa"
                onChange={(hasChanges: boolean) => {
                  setHasUnsavedChanges(hasChanges);
                }}
              />
            )}
            {activeTab === "Location" && (
              <EditLocationTab
                persistedDataKey="get-villa"
                editDataKey="edit-villa"
                onChange={(hasChanges: boolean) => {
                  setHasUnsavedChanges(hasChanges);
                }}
              />
            )}
            {activeTab === "Key Features" && (
              <EditKeyFeaturesTab
                persistedDataKey="get-villa"
                editDataKey="edit-villa"
                onChange={(hasChanges: boolean) => {
                  setHasUnsavedChanges(hasChanges);
                }}
              />
            )}
            {activeTab === "Service & Features" && (
              <EditServiceFeaturesTab
                persistedDataKey="get-villa"
                editDataKey="edit-villa"
                onChange={(hasChanges: boolean) => {
                  setHasUnsavedChanges(hasChanges);
                }}
              />
            )}
            {activeTab === "Villa Policies" && (
              <VillaPoliciesTab
                onChange={(hasChanges: boolean) => {
                  setHasUnsavedChanges(hasChanges);
                }}
              />
            )}
          </>
        )}
      </div>
    </Layout>
  );
};
