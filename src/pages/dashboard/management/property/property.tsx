import * as React from "react";

import { useNavigate } from "react-router-dom";

import { Layout } from "../../../../components/ui";
import { Button } from "../../../../components";

import { IoFilterSharp } from "react-icons/io5";
import { Management } from "./management";
import { Package } from "./package";
import { FaPlus } from "react-icons/fa";

const tabs = ["Management", "Package"];

export const PropertyPage = () => {
  const [activeTab, setActiveTab] = React.useState<string>("Management");
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Header */}
      <header className="flex items-center justify-between pb-4 mb-6 border-b border-dark/20">
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
          <button key={tab} className={`px-4 py-1.5 border border-dark/20 rounded-t-md ${activeTab === tab && "bg-primary text-light"}`} onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Management" && <Management />}
      {activeTab === "Package" && <Package />}
    </Layout>
  );
};
