import * as React from "react";

import { useLocation } from "react-router-dom";

import { useCreateApi, usePersistentData } from "../../../../../hooks";

import { Layout, AddMedia } from "../../../../../components/ui";
import { Button } from "../../../../../components";

import { General } from "./general";

import { ServiceFeatures } from "./service-features";
import { VillaPolicies } from "./villa-policies";
import { KeyFeatures } from "./key-features";

import { FaDownload } from "react-icons/fa";

import { deleteKeysObject } from "../../../../../utils";

import { Villa } from "../../../../../types";
import { AddLocation } from "../../../../../components/ui/location/add-location";

const tabs = ["General", "Media", "Location", "Key Features", "Service & Features", "Villa Policies"];

export const AddHomeVillaPage = () => {
  const { pathname } = useLocation();

  const { mutate: addVillas, isPending } = useCreateApi<Partial<Villa>>({ url: "villas", key: ["add-villa"], redirectPath: "/dashboard/management/home-villa/add" });

  const useStore = usePersistentData<Partial<Villa>>("add-villa");

  const { data } = useStore();

  const [activeTab, setActiveTab] = React.useState<string>(() => {
    return sessionStorage.getItem("activeTab") || "General";
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
    // return () => {
    //   const isLeavingAddPage = pathname === "/dashboard/management/home-villa/add" && window.location.pathname !== "/dashboard/management/home-villa/add";
    //   if (isLeavingAddPage) {
    //     const confirmLeave = window.confirm("Are you sure you want to move the page before publish your villas?");
    //     if (confirmLeave) {
    //       sessionStorage.clear();
    //       localStorage.clear();
    //     } else {
    //       navigate("/dashboard/management/home-villa/add");
    //     }
    //   }
    // };
  }, [activeTab, pathname]);

  const handlePublish = (e: React.MouseEvent) => {
    e.preventDefault();
    const processData = deleteKeysObject(data, ["currency"]);
    addVillas(processData);
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
          <button key={tab} className={`px-4 py-1.5 border border-dark/30 rounded-t-md ${activeTab === tab ? "bg-primary text-light" : "bg-light text-primary"}`} onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "General" && <General />}
      {activeTab === "Media" && <AddMedia persistedDataKey="add-villa" type="villa" />}
      {activeTab === "Location" && <AddLocation persistedDataKey="add-villa" />}
      {activeTab === "Key Features" && <KeyFeatures />}
      {activeTab === "Service & Features" && <ServiceFeatures />}
      {activeTab === "Villa Policies" && <VillaPolicies />}
    </Layout>
  );
};
