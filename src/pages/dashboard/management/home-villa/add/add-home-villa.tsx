import * as React from "react";
import { useLocation } from "react-router-dom";
import { useCreateApi, usePersistentData } from "../../../../../hooks";
import { Layout, AddMedia, AddLocation, AddKeyFeatures, AddServiceFeatures } from "../../../../../components/ui";
import { Button } from "../../../../../components";
import { General } from "./general";
import { VillaPolicies } from "./villa-policies";
import { FaDownload } from "react-icons/fa";
import { deleteKeysObject } from "../../../../../utils";
import { Villa } from "../../../../../types";

// Define a type for tab names to ensure type safety
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

  // Track validation state for each tab separately with proper typing
  const [tabValidationState, setTabValidationState] = React.useState<Record<TabName, boolean>>({
    General: true,
    Media: true,
    Location: true,
    "Key Features": true,
    "Service & Features": true,
    "Villa Policies": true,
  });

  React.useEffect(() => {
    // Set active tab in session storage when on the add villa page
    if (pathname === "/dashboard/management/home-villa/add") {
      sessionStorage.setItem("activeTab", activeTab);
    }

    // Cleanup function that runs when component unmounts or dependencies change
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
    // Get the current tab index and the target tab index
    const currentTabIndex = tabs.indexOf(activeTab);
    const targetTabIndex = tabs.indexOf(tab);

    // Allow navigating back to previous tabs or staying on current tab
    if (targetTabIndex <= currentTabIndex) {
      setActiveTab(tab);
      return;
    }

    // Only allow navigating to the next tab if current tab is valid
    if (targetTabIndex === currentTabIndex + 1) {
      if (tabValidationState[activeTab]) {
        alert("Please complete each section in order.");
        return;
      }
      setActiveTab(tab);
    } else {
      // If trying to skip tabs, prevent it
      alert("Please complete each section in order.");
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

      {activeTab === "General" && (
        <div>
          <General
            onChange={(hasChanges: boolean) => {
              updateTabValidation("General", hasChanges);
            }}
          />
          {!tabValidationState["General"] && (
            <div className="flex justify-end mt-4">
              <Button onClick={() => goToNextTab()} className="btn-primary">
                Next
              </Button>
            </div>
          )}
        </div>
      )}
      {activeTab === "Media" && (
        <div>
          <AddMedia
            persistedDataKey="add-villa"
            type="villa"
            onChange={(hasChanges: boolean) => {
              updateTabValidation("Media", hasChanges);
            }}
          />
        </div>
      )}
      {activeTab === "Location" && (
        <div>
          <AddLocation
            persistedDataKey="add-villa"
            onChange={(hasChanges: boolean) => {
              updateTabValidation("Location", hasChanges);
            }}
          />
        </div>
      )}
      {activeTab === "Key Features" && (
        <div>
          <AddKeyFeatures
            persistedDataKey="add-villa"
            onChange={(hasChanges: boolean) => {
              updateTabValidation("Key Features", hasChanges);
            }}
          />
        </div>
      )}
      {activeTab === "Service & Features" && (
        <div>
          <AddServiceFeatures
            persistedDataKey="add-villa"
            onChange={(hasChanges: boolean) => {
              updateTabValidation("Service & Features", hasChanges);
            }}
          />
        </div>
      )}
      {activeTab === "Villa Policies" && (
        <VillaPolicies
          onChange={(hasChanges: boolean) => {
            updateTabValidation("Villa Policies", hasChanges);
          }}
        />
      )}
    </Layout>
  );
};
