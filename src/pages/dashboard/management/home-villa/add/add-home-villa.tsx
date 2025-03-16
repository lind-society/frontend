import * as React from "react";

import { Layout } from "../../../../../components/ui";
import { Button } from "../../../../../components";

import { FaDownload, FaFirstdraft } from "react-icons/fa6";

import { General } from "./general";
import { Media } from "./media";
import { Location } from "./location";
import { ServiceFeatures } from "./service-features";
import { VillaPolicies } from "./villa-policies";

const tabs = ["General", "Media", "Location", "Service & Features", "Villa Policies"];

export const AddHomeVillaPage = () => {
  const [activeTab, setActiveTab] = React.useState<string>("General");

  return (
    <Layout>
      {/* Header */}
      <header className="flex items-center justify-between pb-4 mb-6 border-b border-dark/20">
        <h1 className="text-2xl font-bold">Add New Home & Villa</h1>

        <div className="flex items-center gap-4">
          <Button className="flex items-center gap-2 btn-outline">
            <FaFirstdraft /> Save as draft
          </Button>
          <Button className="flex items-center gap-2 btn-primary">
            <FaDownload /> Publish
          </Button>
        </div>
      </header>

      <div className="flex">
        {tabs.map((tab) => (
          <button key={tab} className={`px-4 py-1.5 border border-dark/20 rounded-t-md ${activeTab === tab && "bg-primary text-light"}`} onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "General" && <General />}
      {activeTab === "Media" && <Media />}
      {activeTab === "Location" && <Location />}
      {activeTab === "Service & Features" && <ServiceFeatures />}
      {activeTab === "Villa Policies" && <VillaPolicies />}
    </Layout>
  );
};
