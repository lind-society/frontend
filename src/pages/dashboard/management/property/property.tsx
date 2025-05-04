import * as React from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { Layout } from "../../../../components/ui";

import { PackageTab } from "./package";
import { BenefitsTab } from "./benefits";

import { FaCalendar } from "react-icons/fa";

import { formatTitleCase } from "../../../../utils";

type TabName = "package" | "benefit";
const tabs: TabName[] = ["package", "benefit"];

export const PropertyPage = () => {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = React.useState<TabName>(() => {
    const hashTab = hash.replace("#", "");
    return tabs.includes(hashTab as TabName) ? (hashTab as TabName) : "package";
  });

  const [isWaiting, setIsWaiting] = React.useState<boolean>(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsWaiting(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (pathname === "/dashboard/management/property") {
      navigate(`${pathname}#${activeTab}`, { replace: true });
    }
  }, [activeTab, pathname, navigate]);

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
            {formatTitleCase(tab)}
          </button>
        ))}
      </div>

      <div className="p-8 border rounded-b bg-light border-dark/30">
        {isWaiting ? (
          <div className="flex items-center justify-center min-h-400">
            <div className="loader size-10 after:size-10"></div>
          </div>
        ) : (
          <>
            {activeTab === "package" && <PackageTab />}
            {activeTab === "benefit" && <BenefitsTab />}
          </>
        )}
      </div>
    </Layout>
  );
};
