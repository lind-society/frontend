import * as React from "react";

import { Layout } from "../../../../components/ui";

import { PackageTab } from "./package";
import { BenefitsTab } from "./benefits";

import { FaCalendar } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const tabs = ["Packages", "Benefits"];

export const PropertyPage = () => {
  const { pathname } = useLocation();

  const [activeTab, setActiveTab] = React.useState<string>(() => {
    return sessionStorage.getItem("activeTab") || "Packages";
  });

  React.useEffect(() => {
    if (pathname === "/dashboard/management/property") {
      sessionStorage.setItem("activeTab", activeTab);
    }

    return () => {
      sessionStorage.removeItem("activeTab");
    };
  }, [activeTab, pathname]);

  const formatted = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "medium",
  }).format(new Date());

  return (
    <Layout>
      {/* Header */}
      <header className="flex items-center justify-between pb-4 mb-6 border-b border-dark/30">
        <h1 className="head-title">Property Management</h1>

        <span className="flex items-center gap-2 px-4 py-2 rounded bg-light">
          <FaCalendar /> {formatted}
        </span>
      </header>

      <div className="flex">
        {tabs.map((tab) => (
          <button key={tab} className={`px-4 py-1.5 border border-dark/30 rounded-t-md ${activeTab === tab ? "bg-primary text-light" : "bg-light text-primary"}`} onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </div>

      <div className="p-8 border rounded-b bg-light border-dark/30">
        {activeTab === "Packages" && <PackageTab />}
        {activeTab === "Benefits" && <BenefitsTab />}
      </div>
    </Layout>
  );
};
