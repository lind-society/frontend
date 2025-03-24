import * as React from "react";
import { Layout } from "../../../../../components/ui";

import { Button } from "../../../../../components";

import { FaDownload, FaFirstdraft } from "react-icons/fa";

import { General } from "./general";
import { Media } from "./media";
import { Location } from "./location";
import { ServiceFeatures } from "./service-features";
import { VillaPolicies } from "./villa-policies";
import { RentManagement } from "./rent-management";

const tabs = ["Rent Management", "General", "Media", "Location", "Service & Features", "Villa Policies"];

export const EditHomeVillaPage = () => {
  const [activeTab, setActiveTab] = React.useState<string>("Rent Management");

  return (
    <Layout>
      {/* Header */}
      <header className="flex items-center justify-between pb-4 mb-6 border-b border-dark/20">
        <h1 className="text-2xl font-bold">Uma Santai Villa Details</h1>

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

      {activeTab === "Rent Management" && <RentManagement />}
      {activeTab === "General" && <General />}
      {activeTab === "Media" && <Media />}
      {activeTab === "Location" && <Location />}
      {activeTab === "Service & Features" && <ServiceFeatures />}
      {activeTab === "Villa Policies" && <VillaPolicies />}
    </Layout>
  );
};
