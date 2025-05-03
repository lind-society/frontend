import * as React from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { useCreateApi, usePersistentData } from "../../../../../hooks";

import { Layout, AddMediaTab, AddLocationTab, AddKeyFeaturesTab, AddServiceFeaturesTab } from "../../../../../components/ui";

import { Button } from "../../../../../components";

import { GeneralTab } from "./general";
import { VillaPoliciesTab } from "./villa-policies";

import { FaArrowLeft, FaUpload } from "react-icons/fa";
import { GrLinkNext } from "react-icons/gr";

import { deleteKeysObject, formatTitleCase } from "../../../../../utils";

import { Villa } from "../../../../../types";

type TabName = "general" | "media" | "location" | "key-features" | "service-features" | "villa-policies";

const tabs: TabName[] = ["general", "media", "location", "key-features", "service-features", "villa-policies"];

const getInitialTabValidationState = (): Record<TabName, boolean> => ({
  general: JSON.parse(sessionStorage.getItem("general") || "true"),
  media: JSON.parse(sessionStorage.getItem("media") || "true"),
  location: JSON.parse(sessionStorage.getItem("location") || "true"),
  "key-features": JSON.parse(sessionStorage.getItem("key-features") || "true"),
  "service-features": JSON.parse(sessionStorage.getItem("service-features") || "true"),
  "villa-policies": JSON.parse(sessionStorage.getItem("villa-policies") || "true"),
});

export const AddHomeVillaPage = () => {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();

  const { mutate: addVillas, isPending } = useCreateApi<Partial<Villa>>({ key: ["add-villa"], url: "/villas", redirectPath: "/dashboard/management/home-villa" });
  const useStore = usePersistentData<Partial<Villa>>("add-villa");
  const { data } = useStore();

  const [activeTab, setActiveTab] = React.useState<TabName>(() => {
    // Get tab from URL hash if available
    const hashTab = hash.replace("#", "");
    return tabs.includes(hashTab as TabName) ? (hashTab as TabName) : "general";
  });

  const [tabValidationState, setTabValidationState] = React.useState<Record<TabName, boolean>>(getInitialTabValidationState);
  const [isWaiting, setIsWaiting] = React.useState<boolean>(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsWaiting(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (pathname === "/dashboard/management/home-villa/add") {
      navigate(`${pathname}#${activeTab}`, { replace: true });
    }
  }, [activeTab, pathname, navigate]);

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
          {!tabValidationState["general"] &&
            !tabValidationState["key-features"] &&
            !tabValidationState["location"] &&
            !tabValidationState["media"] &&
            !tabValidationState["service-features"] &&
            !tabValidationState["villa-policies"] && (
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
            {formatTitleCase(tab)}
          </button>
        ))}
      </div>

      <div className="p-8 border rounded-b bg-light border-dark/30">
        {isWaiting ? (
          <div className="flex items-center justify-center min-h-400">
            <div className="loader size-10 after:size-10"></div>
          </div>
        ) : (
          <>
            {activeTab === "general" && (
              <>
                <GeneralTab
                  onChange={(hasChanges: boolean) => {
                    updateTabValidation("general", hasChanges);
                  }}
                />
                {!tabValidationState["general"] && (
                  <div className="flex justify-end mt-4">
                    <Button onClick={() => goToNextTab()} className="flex items-center gap-2 btn-primary">
                      Next <GrLinkNext />
                    </Button>
                  </div>
                )}
              </>
            )}
            {activeTab === "media" && (
              <>
                <AddMediaTab
                  persistedDataKey="add-villa"
                  type="villa"
                  onChange={(hasChanges: boolean) => {
                    updateTabValidation("media", hasChanges);
                  }}
                />
                {!tabValidationState["media"] && (
                  <div className="flex justify-end mt-4">
                    <Button onClick={() => goToNextTab()} className="flex items-center gap-2 btn-primary">
                      Next <GrLinkNext />
                    </Button>
                  </div>
                )}
              </>
            )}
            {activeTab === "location" && (
              <>
                <AddLocationTab
                  persistedDataKey="add-villa"
                  onChange={(hasChanges: boolean) => {
                    updateTabValidation("location", hasChanges);
                  }}
                />
                {!tabValidationState["location"] && (
                  <div className="flex justify-end mt-4">
                    <Button onClick={() => goToNextTab()} className="flex items-center gap-2 btn-primary">
                      Next <GrLinkNext />
                    </Button>
                  </div>
                )}
              </>
            )}
            {activeTab === "key-features" && (
              <>
                <AddKeyFeaturesTab
                  persistedDataKey="add-villa"
                  onChange={(hasChanges: boolean) => {
                    updateTabValidation("key-features", hasChanges);
                  }}
                />
                {!tabValidationState["key-features"] && (
                  <div className="flex justify-end mt-4">
                    <Button onClick={() => goToNextTab()} className="flex items-center gap-2 btn-primary">
                      Next <GrLinkNext />
                    </Button>
                  </div>
                )}
              </>
            )}
            {activeTab === "service-features" && (
              <>
                <AddServiceFeaturesTab
                  persistedDataKey="add-villa"
                  onChange={(hasChanges: boolean) => {
                    updateTabValidation("service-features", hasChanges);
                  }}
                />
                {!tabValidationState["service-features"] && (
                  <div className="flex justify-end mt-4">
                    <Button onClick={() => goToNextTab()} className="flex items-center gap-2 btn-primary">
                      Next <GrLinkNext />
                    </Button>
                  </div>
                )}
              </>
            )}
            {activeTab === "villa-policies" && (
              <VillaPoliciesTab
                onChange={(hasChanges: boolean) => {
                  updateTabValidation("villa-policies", hasChanges);
                }}
              />
            )}
          </>
        )}
      </div>
    </Layout>
  );
};
