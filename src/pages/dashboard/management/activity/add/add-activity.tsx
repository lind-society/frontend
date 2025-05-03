import * as React from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { useCreateApi, usePersistentData } from "../../../../../hooks";

import { Layout, AddLocationTab } from "../../../../../components/ui";

import { Button } from "../../../../../components";

import { GeneralTab } from "./general";

import { FaArrowLeft, FaUpload } from "react-icons/fa";
import { GrLinkNext } from "react-icons/gr";

import { deleteKeysObject } from "../../../../../utils";

import { Activity } from "../../../../../types";
import { AddMediaTab } from "./media";

type TabName = "general" | "media" | "location";

const tabs: TabName[] = ["general", "media", "location"];

const getInitialTabValidationState = (): Record<TabName, boolean> => ({
  general: JSON.parse(sessionStorage.getItem("general") || "true"),
  media: JSON.parse(sessionStorage.getItem("media") || "true"),
  location: JSON.parse(sessionStorage.getItem("location") || "true"),
});

export const AddActivityPage = () => {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();

  const { mutate: addActivity, isPending } = useCreateApi<Partial<Activity>>({ key: ["add-activity"], url: "/activities", redirectPath: "/dashboard/management/activity" });
  const useStore = usePersistentData<Partial<Activity>>("add-activity");
  const { data } = useStore();

  const [activeTab, setActiveTab] = React.useState<TabName>(() => {
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
    if (pathname === "/dashboard/management/activity/add") {
      navigate(`${pathname}#${activeTab}`, { replace: true });
    }
  }, [activeTab, pathname, navigate]);

  const handlePublish = (e: React.MouseEvent) => {
    e.preventDefault();
    const processData = deleteKeysObject(data, ["currency"]);
    addActivity(processData);
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
          <h1 className="head-title">Add Activity</h1>
        </div>

        <div className="flex items-center gap-4">
          {!tabValidationState["general"] && !tabValidationState["location"] && !tabValidationState["media"] && (
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
                  persistedDataKey="add-activity"
                  onChange={(hasChanges: boolean) => {
                    updateTabValidation("location", hasChanges);
                  }}
                />
              </>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};
