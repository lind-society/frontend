import * as React from "react";

import { useLocation } from "react-router-dom";

import { useCreateApi, usePersistentData } from "../../../../../hooks";

import { Layout } from "../../../../../components/ui";
import { Button } from "../../../../../components";

import { FaDownload, FaFirstdraft } from "react-icons/fa";

import { General } from "./general";
import { Media } from "./media";
import { Location } from "./location";
import { ServiceFeatures } from "./service-features";
import { VillaPolicies } from "./villa-policies";
import { KeyFeatures } from "./key-features";

import { Villa } from "../../../../../types";

const tabs = ["General", "Media", "Location", "Key Features", "Service & Features", "Villa Policies"];

export const AddHomeVillaPage = () => {
  const { pathname } = useLocation();

  const { mutate: addVillas } = useCreateApi("villas", ["villas"]);

  const useStore = usePersistentData<Partial<Villa>>("add-villa");

  const { data } = useStore();

  const [activeTab, setActiveTab] = React.useState<string>(() => {
    return sessionStorage.getItem("activeTab") || "General";
  });

  React.useEffect(() => {
    if (pathname === "/dashboard/management/home-villa/add") {
      sessionStorage.setItem("activeTab", activeTab);
    }

    return () => {
      if (window.location.pathname !== "/dashboard/management/home-villa/add") {
        sessionStorage.clear();
      }
    };
  }, [activeTab, pathname]);

  const handleSaveDraft = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.setItem("data", data as string);
  };

  const handlePublish = (e: React.MouseEvent) => {
    e.preventDefault();
    addVillas(data);
  };

  return (
    <Layout>
      {/* Header */}
      <header className="flex items-center justify-between pb-4 mb-6 border-b border-dark/20">
        <h1 className="text-2xl font-bold">Add New Home & Villa</h1>

        <div className="flex items-center gap-4">
          <Button className="flex items-center gap-2 btn-outline" onClick={handleSaveDraft}>
            <FaFirstdraft /> Save as draft
          </Button>
          <Button className="flex items-center gap-2 btn-primary" onClick={handlePublish}>
            <FaDownload /> Publish
          </Button>
        </div>
      </header>

      <div className="flex">
        {tabs.map((tab) => (
          <button key={tab} className={`px-4 py-1.5 border border-dark/20 rounded-t-md ${activeTab === tab ? "bg-primary text-light" : "bg-light text-primary"}`} onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "General" && <General />}
      {activeTab === "Media" && <Media />}
      {activeTab === "Location" && <Location />}
      {activeTab === "Key Features" && <KeyFeatures />}
      {activeTab === "Service & Features" && <ServiceFeatures />}
      {activeTab === "Villa Policies" && <VillaPolicies />}
    </Layout>
  );
};
