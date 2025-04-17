import * as React from "react";

import { useLocation } from "react-router-dom";

import { useCreateApi, usePersistentData } from "../../../../../hooks";

import { Layout, AddMedia, AddLocation, AddKeyFeatures, AddServiceFeatures } from "../../../../../components/ui";
import { Button } from "../../../../../components";
import { General } from "./general";
import { VillaPolicies } from "./villa-policies";

import { FaDownload } from "react-icons/fa";
import { GrLinkNext } from "react-icons/gr";

import { deleteKeysObject } from "../../../../../utils";

import { Villa } from "../../../../../types";

type TabName = "General" | "Media" | "Location" | "Key Features" | "Service & Features" | "Villa Policies";

const tabs: TabName[] = ["General", "Media", "Location", "Key Features", "Service & Features", "Villa Policies"];

export const AddHomeVillaPage = () => {
  const { pathname } = useLocation();
  const { mutate: addVillas, isPending } = useCreateApi<Partial<Villa>>({ url: "villas", key: ["add-villa"], redirectPath: "/dashboard/management/home-villa/add" });
  const useStore = usePersistentData<Partial<Villa>>("add-villa");
  const { data } = useStore();

  const [activeTab, setActiveTab] = React.useState<TabName>(() => {
    const storedTab = sessionStorage.getItem("activeTab");
    return (storedTab as TabName) || "General";
  });

  const [tabValidationState, setTabValidationState] = React.useState<Record<TabName, boolean>>({
    General: true,
    Media: true,
    Location: true,
    "Key Features": true,
    "Service & Features": true,
    "Villa Policies": true,
  });

  React.useEffect(() => {
    if (pathname === "/dashboard/management/home-villa/add") {
      sessionStorage.setItem("activeTab", activeTab);
    }

    return () => {
      sessionStorage.removeItem("activeTab");
    };
  }, [activeTab, pathname]);

  const handlePublish = (e: React.MouseEvent) => {
    e.preventDefault();
    const processData = deleteKeysObject(data, ["currency"]);
    addVillas(processData);
  };

  const updateTabValidation = (tab: TabName, hasUnsavedChanges: boolean) => {
    setTabValidationState((prev) => ({
      ...prev,
      [tab]: hasUnsavedChanges,
    }));
  };

  const handleNavigateAway = (tab: TabName) => {
    const currentTabIndex = tabs.indexOf(activeTab);
    const targetTabIndex = tabs.indexOf(tab);

    if (targetTabIndex <= currentTabIndex) {
      setActiveTab(tab);
      return;
    }

    if (targetTabIndex === currentTabIndex + 1) {
      if (tabValidationState[activeTab]) {
        alert("Please complete each section in order.");
        return;
      }
      setActiveTab(tab);
      return;
    }

    if (targetTabIndex >= currentTabIndex) {
      if (tabValidationState[activeTab]) {
        alert("Please complete each section in order.");
        return;
      }
      setActiveTab(tab);
      return;
    }
  };

  // Function to navigate to the next tab
  const goToNextTab = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  return (
    <Layout>
      {/* Header */}
      <header className="flex items-center justify-between pb-4 mb-6 border-b border-dark/30">
        <h1 className="text-2xl font-bold">Add New Home & Villa</h1>

        <div className="flex items-center gap-4">
          <Button onClick={handlePublish} className="btn-primary">
            {isPending ? (
              <div className="loader size-4 after:size-4"></div>
            ) : (
              <div className="flex items-center gap-2 ">
                <FaDownload /> Publish
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

      <div className="p-8 border rounded-b bg-light border-dark/30">
        {activeTab === "General" && (
          <>
            <General
              onChange={(hasChanges: boolean) => {
                updateTabValidation("General", hasChanges);
              }}
            />
            {!tabValidationState["General"] && (
              <div className="flex justify-end mt-4">
                <Button onClick={() => goToNextTab()} className="flex items-center gap-2 btn-primary">
                  Next <GrLinkNext />
                </Button>
              </div>
            )}
          </>
        )}
        {activeTab === "Media" && (
          <>
            <AddMedia
              persistedDataKey="add-villa"
              type="villa"
              onChange={(hasChanges: boolean) => {
                updateTabValidation("Media", hasChanges);
              }}
            />
            {!tabValidationState["Media"] && (
              <div className="flex justify-end mt-4">
                <Button onClick={() => goToNextTab()} className="flex items-center gap-2 btn-primary">
                  Next <GrLinkNext />
                </Button>
              </div>
            )}
          </>
        )}
        {activeTab === "Location" && (
          <>
            <AddLocation
              persistedDataKey="add-villa"
              onChange={(hasChanges: boolean) => {
                updateTabValidation("Location", hasChanges);
              }}
            />
            {!tabValidationState["Location"] && (
              <div className="flex justify-end mt-4">
                <Button onClick={() => goToNextTab()} className="flex items-center gap-2 btn-primary">
                  Next <GrLinkNext />
                </Button>
              </div>
            )}
          </>
        )}
        {activeTab === "Key Features" && (
          <>
            <AddKeyFeatures
              persistedDataKey="add-villa"
              onChange={(hasChanges: boolean) => {
                updateTabValidation("Key Features", hasChanges);
              }}
            />
            {!tabValidationState["Key Features"] && (
              <div className="flex justify-end mt-4">
                <Button onClick={() => goToNextTab()} className="flex items-center gap-2 btn-primary">
                  Next <GrLinkNext />
                </Button>
              </div>
            )}
          </>
        )}
        {activeTab === "Service & Features" && (
          <>
            <AddServiceFeatures
              persistedDataKey="add-villa"
              onChange={(hasChanges: boolean) => {
                updateTabValidation("Service & Features", hasChanges);
              }}
            />
            {!tabValidationState["Service & Features"] && (
              <div className="flex justify-end mt-4">
                <Button onClick={() => goToNextTab()} className="flex items-center gap-2 btn-primary">
                  Next <GrLinkNext />
                </Button>
              </div>
            )}
          </>
        )}
        {activeTab === "Villa Policies" && (
          <VillaPolicies
            onChange={(hasChanges: boolean) => {
              updateTabValidation("Villa Policies", hasChanges);
            }}
          />
        )}
      </div>
    </Layout>
  );
};
