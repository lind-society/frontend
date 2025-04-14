import * as React from "react";

import { useLocation, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const { mutate: addProperty, isPending } = useCreateApi<Partial<Property>>({ url: "properties", key: ["add-property"], redirectPath: "/dashboard/management/buy" });

  const useStore = usePersistentData<Partial<Property>>("add-property");

  const { data } = useStore();

  const [activeTab, setActiveTab] = React.useState<string>(() => {
    return sessionStorage.getItem("activeTab") || "General";
  });

  React.useEffect(() => {
    // Set active tab in session storage when on the add villa page
    if (pathname === "/dashboard/management/buy/add") {
      sessionStorage.setItem("activeTab", activeTab);
    }

    // Cleanup function that runs when component unmounts or dependencies change
    return () => {
      const isLeavingAddPage = pathname === "/dashboard/management/buy/add" && window.location.pathname !== "/dashboard/management/buy/add";
      if (isLeavingAddPage) {
        const confirmLeave = window.confirm("Are you sure you want to move the page before publish your property?");
        if (confirmLeave) {
          sessionStorage.clear();
          localStorage.clear();
        } else {
          navigate("/dashboard/management/buy/add");
        }
      }
    };
  }, [activeTab, pathname, navigate]);

  const handlePublish = (e: React.MouseEvent) => {
    e.preventDefault();
    const processData = deleteKeysObject(data, ["currency"]);
    addProperty(processData);
  };

  return (
    <Layout>
      {/* Header */}
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
