import * as React from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { useCreateApi, usePersistentData } from "../../../../../hooks";

import { Layout, AddMediaTab, AddLocationTab, AddKeyFeaturesTab, AddServiceFeaturesTab } from "../../../../../components/ui";

import { Button } from "../../../../../components";

import { GeneralTab } from "./general";
import { VillaPoliciesTab } from "./villa-policies";

import { FaArrowLeft, FaUpload } from "react-icons/fa";
import { GrLinkNext } from "react-icons/gr";

import { deleteKeysObject } from "../../../../../utils";

import { Villa } from "../../../../../types";

type TabName = "General" | "Media" | "Location" | "Key Features" | "Service & Features" | "Villa Policies";

const tabs: TabName[] = ["General", "Media", "Location", "Key Features", "Service & Features", "Villa Policies"];

const getInitialTabValidationState = (): Record<TabName, boolean> => ({
  General: JSON.parse(sessionStorage.getItem("General") || "true"),
  Media: JSON.parse(sessionStorage.getItem("Media") || "true"),
  Location: JSON.parse(sessionStorage.getItem("Location") || "true"),
  "Key Features": JSON.parse(sessionStorage.getItem("Key Features") || "true"),
  "Service & Features": JSON.parse(sessionStorage.getItem("Service & Features") || "true"),
  "Villa Policies": JSON.parse(sessionStorage.getItem("Villa Policies") || "true"),
});

export const AddHomeVillaPage = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { mutate: addVillas, isPending } = useCreateApi<Partial<Villa>>({ key: ["add-villa"], url: "/villas", redirectPath: "/dashboard/management/home-villa/add" });
  const useStore = usePersistentData<Partial<Villa>>("add-villa");
  const { data } = useStore();

  const [activeTab, setActiveTab] = React.useState<TabName>(() => {
    const storedTab = sessionStorage.getItem("activeTab");
    return (storedTab as TabName) || "General";
  });

  const [tabValidationState, setTabValidationState] = React.useState<Record<TabName, boolean>>(getInitialTabValidationState);

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
    setTabValidationState((prev) => ({ ...prev, [tab]: hasUnsavedChanges }));
    sessionStorage.setItem(tab, JSON.stringify(hasUnsavedChanges));
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
        <div className="flex items-center gap-4">
          <Button className="btn-primary" onClick={() => navigate(-1)}>
            <FaArrowLeft size={20} />
          </Button>
          <h1 className="head-title">Add New Home & Villa</h1>
        </div>

        <div className="flex items-center gap-4">
          {!tabValidationState["General"] &&
            !tabValidationState["Key Features"] &&
            !tabValidationState["Location"] &&
            !tabValidationState["Media"] &&
            !tabValidationState["Service & Features"] &&
            !tabValidationState["Villa Policies"] && (
              <Button onClick={handlePublish} className="btn-primary">
                {isPending ? (
                  <div className="loader size-4 after:size-4"></div>
                ) : (
                  <div className="flex items-center gap-2 ">
                    <FaUpload /> Publish
                  </div>
                )}
              </Button>
            )}
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
            <GeneralTab
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
            <AddMediaTab
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
            <AddLocationTab
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
            <AddKeyFeaturesTab
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
            <AddServiceFeaturesTab
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
          <VillaPoliciesTab
            onChange={(hasChanges: boolean) => {
              updateTabValidation("Villa Policies", hasChanges);
            }}
          />
        )}
      </div>
    </Layout>
  );
};
