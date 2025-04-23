import * as React from "react";

import { useNavigate } from "react-router-dom";

import { PackageTab } from "./package";

import { Layout } from "../../../../components/ui";
import { Button } from "../../../../components";

import { IoFilterSharp } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";

const tabs = ["Package"];

export const PropertyPage = () => {
  const [activeTab, setActiveTab] = React.useState<string>("Package");
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Header */}
      <header className="flex items-center justify-between pb-4 mb-6 border-b border-dark/30">
        <h1 className="text-2xl font-bold">Property Management</h1>

        {activeTab === "Management" ? (
          <span className="flex items-center gap-2 px-4 py-2 rounded bg-light">
            <IoFilterSharp /> Filters
          </span>
        ) : (
          <Button onClick={() => navigate("/dashboard/management/property/package/add")} className="flex items-center gap-2 btn-primary">
            <FaPlus /> Add New
          </Button>
        )}
      </header>

      <div className="flex">
        {tabs.map((tab) => (
          <button key={tab} className={`px-4 py-1.5 border border-dark/30 rounded-t-md ${activeTab === tab && "bg-primary text-light"}`} onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </div>
      {/* 
      {activeTab === "Management" && <ManagementTab />} */}
      {activeTab === "Package" && <PackageTab />}
      {/* <div className="flex items-center justify-center min-h-400">
        <h2 className="text-4xl font-semibold text-dark/50">Coming soon</h2>
      </div> */}
    </Layout>
  );
};
