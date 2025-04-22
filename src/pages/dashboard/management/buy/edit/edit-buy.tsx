import * as React from "react";

import { useLocation, useParams } from "react-router-dom";

import { useGetApi, usePersistentData, useUpdateApi } from "../../../../../hooks";

import { General } from "./general";
import { EditKeyFeatures, EditLocation, EditMedia, EditServiceFeatures, Layout } from "../../../../../components/ui";
import { Button } from "../../../../../components";

import { FaUpload } from "react-icons/fa";

import { deleteKeysObject } from "../../../../../utils";

import { Payload, Property } from "../../../../../types";

const tabs = ["General", "Media", "Location", "Key Features", "Service & Features"];

export const EditBuyPage = () => {
  const { pathname } = useLocation();
  const { id } = useParams();

  const { mutate: editProperty, isPending } = useUpdateApi<Partial<Property>>({ url: "properties", key: ["editing-property"], redirectPath: "/dashboard/management/buy" });

  const { data: responseProperty, isLoading } = useGetApi<Payload<Property>>({ url: `properties/${id}`, key: ["get-property", id] });

  const useStore = usePersistentData<Property>("get-property");
  const useEdit = usePersistentData<Property>("edit-property");

  const { setData } = useStore();
  const { data } = useEdit();

  const [activeTab, setActiveTab] = React.useState<string>(() => {
    return sessionStorage.getItem("activeTab") || "General";
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
    if (pathname === `/dashboard/management/buy/edit/${id}`) {
      sessionStorage.setItem("activeTab", activeTab);
    }

    return () => {
      sessionStorage.removeItem("activeTab");
    };
  }, [pathname, activeTab]);

  React.useEffect(() => {
    if (responseProperty) {
      const { data: responseData } = responseProperty;
      setData({
        ...responseData,
        facilities: responseData.facilities.map((facility) => ({
          id: facility.id,
          description: facility.description,
        })) as Property["facilities"],
      });
    }
  }, [responseProperty]);

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
    editProperty({ updatedItem: processData, id: id || "" });
  };

  return (
    <Layout>
      <header className="flex items-center justify-between pb-4 mb-6 border-b border-dark/30">
        <h1 className="text-2xl font-bold">{responseProperty?.data.name}</h1>

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
        {isLoading || isWaiting ? (
          <div className="flex items-center justify-center min-h-400">
            <div className="loader size-10 after:size-10"></div>
          </div>
        ) : (
          <>
            {activeTab === "General" && (
              <General
                onChange={(hasChanges: boolean) => {
                  setHasUnsavedChanges(hasChanges);
                }}
              />
            )}
            {activeTab === "Media" && (
              <EditMedia
                persistedDataKey="get-property"
                editDataKey="edit-property"
                type="property"
                onChange={(hasChanges: boolean) => {
                  setHasUnsavedChanges(hasChanges);
                }}
              />
            )}
            {activeTab === "Location" && (
              <EditLocation
                persistedDataKey="get-property"
                editDataKey="edit-property"
                onChange={(hasChanges: boolean) => {
                  setHasUnsavedChanges(hasChanges);
                }}
              />
            )}
            {activeTab === "Key Features" && (
              <EditKeyFeatures
                persistedDataKey="get-property"
                editDataKey="edit-property"
                onChange={(hasChanges: boolean) => {
                  setHasUnsavedChanges(hasChanges);
                }}
              />
            )}
            {activeTab === "Service & Features" && (
              <EditServiceFeatures
                persistedDataKey="get-property"
                editDataKey="edit-property"
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
