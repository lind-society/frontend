import * as React from "react";

import { useLocation } from "react-router-dom";

import { useCreateApi, usePersistentData } from "../../../../../hooks";

import { Layout } from "../../../../../components/ui";
import { Button } from "../../../../../components";

import { FaDownload } from "react-icons/fa";

import { General } from "./general";
import { Media } from "./media";
import { Location } from "./location";
import { ServiceFeatures } from "./service-features";
import { KeyFeatures } from "./key-features";

import { deleteKeysObject } from "../../../../../utils";

import { Property } from "../../../../../types";

const tabs = ["General", "Media", "Location", "Key Features", "Service & Features"];

export const AddBuyPage = () => {
  const { pathname } = useLocation();

  const { mutate: addProperty } = useCreateApi<Partial<Property>>("properties", ["add-property"]);

  const useStore = usePersistentData<Partial<Property>>("add-property");

  const { data } = useStore();

  const [activeTab, setActiveTab] = React.useState<string>(() => {
    return sessionStorage.getItem("activeTab") || "General";
  });

  React.useEffect(() => {
    if (pathname === "/dashboard/management/buy/add") {
      sessionStorage.setItem("activeTab", activeTab);
    }

    return () => {
      if (window.location.pathname !== "/dashboard/management/buy/add") {
        if (!window.confirm("Are you sure you want to move the page before publish your property?")) return;
        sessionStorage.clear();
      }
    };
  }, [activeTab, pathname]);

  // const handleSaveDraft = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   setData(data);
  // };

  const handlePublish = (e: React.MouseEvent) => {
    e.preventDefault();
    const processData = deleteKeysObject(data, ["currencyCode", "ownerName"]);
    addProperty(processData);
    setTimeout(() => {
      window.location.href = "/dashboard/management/buy";
    }, 2000);
  };

  return (
    <Layout>
      {/* Header */}
      <header className="flex items-center justify-between pb-4 mb-6 border-b border-dark/30">
        <h1 className="text-2xl font-bold">Add Property</h1>

        <div className="flex items-center gap-4">
          {/* <Button className="flex items-center gap-2 btn-outline" onClick={handleSaveDraft}>
            <FaFirstdraft /> Save as draft
          </Button> */}
          <Button className="flex items-center gap-2 btn-primary" onClick={handlePublish}>
            <FaDownload /> Publish
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
      {activeTab === "Media" && <Media />}
      {activeTab === "Location" && <Location />}
      {activeTab === "Key Features" && <KeyFeatures />}
      {activeTab === "Service & Features" && <ServiceFeatures />}
    </Layout>
  );
};
