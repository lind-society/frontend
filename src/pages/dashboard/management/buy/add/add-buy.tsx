import * as React from "react";

import { useLocation } from "react-router-dom";

import { useCreateApi, usePersistentData } from "../../../../../hooks";

import { General } from "./general";
import { AddKeyFeatures, AddLocation, AddMedia, AddServiceFeatures, Layout } from "../../../../../components/ui";
import { Button } from "../../../../../components";

import { FaDownload } from "react-icons/fa";
import { GrLinkNext } from "react-icons/gr";

import { deleteKeysObject } from "../../../../../utils";

import { Property } from "../../../../../types";

type TabName = "General" | "Media" | "Location" | "Key Features" | "Service & Features";

const tabs: TabName[] = ["General", "Media", "Location", "Key Features", "Service & Features"];

export const AddBuyPage = () => {
  const { pathname } = useLocation();

  const { mutate: addProperty, isPending } = useCreateApi<Partial<Property>>({ url: "properties", key: ["add-property"], redirectPath: "/dashboard/management/buy" });

  const useStore = usePersistentData<Partial<Property>>("add-property");

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
  });

  React.useEffect(() => {
    // Set active tab in session storage when on the add property page
    if (pathname === "/dashboard/management/buy/add") {
      sessionStorage.setItem("activeTab", activeTab);
    }

    return () => {
      sessionStorage.removeItem("activeTab");
    };
  }, [activeTab, pathname]);

  const handlePublish = (e: React.MouseEvent) => {
    e.preventDefault();
    const processData = deleteKeysObject(data, ["currency"]);
    addProperty(processData);
  };

  const updateTabValidation = (tab: TabName, hasUnsavedChanges: boolean) => {
    setTabValidationState((prev) => ({ ...prev, [tab]: hasUnsavedChanges }));
  };

  const handleNavigateAway = (tab: TabName) => {
    const currentTabIndex = tabs.indexOf(activeTab);
    const targetTabIndex = tabs.indexOf(tab);

    if (targetTabIndex < currentTabIndex) {
      setActiveTab(tab);
      return;
    }

    if (targetTabIndex === currentTabIndex) return;

    const allPreviousTabsValid = tabs.slice(0, targetTabIndex).every((tabName) => tabValidationState[tabName] === false);

    if (!allPreviousTabsValid) {
      alert("Please complete each previous section before continuing.");
      return;
    }

    setActiveTab(tab);
  };

  const goToNextTab = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  return (
    <Layout>
      <header className="flex items-center justify-between pb-4 mb-6 border-b border-dark/30">
        <h1 className="text-2xl font-bold">Add Buy Management</h1>

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
              persistedDataKey="add-property"
              type="property"
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
              persistedDataKey="add-property"
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
              persistedDataKey="add-property"
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
          <AddServiceFeatures
            persistedDataKey="add-property"
            onChange={(hasChanges: boolean) => {
              updateTabValidation("Service & Features", hasChanges);
            }}
          />
        )}
      </div>
    </Layout>
  );
};
