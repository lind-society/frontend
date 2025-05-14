import * as React from "react";

import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useGetApi, usePersistentData, useUpdateApi } from "../../../../../hooks";

import { EditLocationTab, Layout } from "../../../../../components/ui";

import { Button } from "../../../../../components";

import { FaArrowLeft, FaUpload } from "react-icons/fa";

import { GeneralTab } from "./general";
import { ReviewTab } from "./review";

import { Payload, Activity, OptionType } from "../../../../../types";

import { deleteKeysObject } from "../../../../../utils";
import { OrderManagementTab } from "./order-management";
import { EditMediaTab } from "./media";

type TabName = "order-management" | "general" | "media" | "location" | "review";

const tabs: TabName[] = ["order-management", "general", "media", "location", "review"];

export const EditActivityPage = () => {
  const { pathname, hash } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const useStore = usePersistentData<Activity>("get-activity");
  const useEdit = usePersistentData<Activity>("edit-activity");
  const useCurrency = usePersistentData<OptionType>("selected-currency", "localStorage");

  const { setData } = useStore();
  const { data } = useEdit();
  const { data: currency } = useCurrency();

  const { mutate: editActivity, isPending } = useUpdateApi<Partial<Activity>>({ key: ["editing-activity"], url: "/activities", redirectPath: "/dashboard/management/activity" });

  const { data: respActivity, isLoading } = useGetApi<Payload<Activity>>({ url: `activities/${id}`, key: ["get-activity", id], params: { baseCurrencyId: currency.value } });

  const [activeTab, setActiveTab] = React.useState<TabName>(() => {
    const hashTab = hash.replace("#", "");
    return tabs.includes(hashTab as TabName) ? (hashTab as TabName) : "order-management";
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState<boolean>(false);
  const [isWaiting, setIsWaiting] = React.useState<boolean>(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsWaiting(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (pathname === `/dashboard/management/activity/edit/${id}`) {
      navigate(`${pathname}#${activeTab}`, { replace: true });
    }
  }, [pathname, activeTab, navigate, id]);

  React.useEffect(() => {
    if (respActivity) {
      const { data: responseData } = respActivity;

      setData({
        ...responseData,
      });
    }
  }, [respActivity]);

  const handleNavigateAway = (tab: TabName) => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm("You have unsaved changes. Are you sure you want to leave?");
      if (!confirmLeave) {
        return;
      }
    }
    setActiveTab(tab);
  };

  const handlePublish = (e: React.MouseEvent) => {
    e.preventDefault();
    const processData = deleteKeysObject(data, ["currency", "pivotId", "facilities", "priceAfterDiscount", "createdAt", "updatedAt", "id"]);
    editActivity({ updatedItem: processData, id: id || "" });
  };

  return (
    <Layout>
      <header className="flex items-center justify-between pb-4 mb-6 border-b border-dark/30">
        <div className="flex items-center gap-4">
          <Button className="btn-primary" onClick={() => navigate(-1)}>
            <FaArrowLeft size={20} />
          </Button>
          <h1 className="head-title">{respActivity?.data.name}</h1>
        </div>

        <div className="flex items-center gap-4">
          <Button onClick={handlePublish} className="btn-primary">
            {isPending ? (
              <div className="loader size-4 after:size-4"></div>
            ) : (
              <div className="flex items-center gap-2">
                <FaUpload /> Publish
              </div>
            )}
          </Button>
        </div>
      </header>

      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-1.5 border border-dark/30 rounded-t-md ${activeTab === tab ? "bg-primary text-light" : "bg-light text-primary"}`}
            onClick={() => handleNavigateAway(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="relative p-8 border rounded-b bg-light border-dark/30 min-h-600">
        {activeTab === "order-management" && <OrderManagementTab />}
        {activeTab === "review" && <ReviewTab />}
        {isLoading || isWaiting ? (
          <div className="flex items-center justify-center min-h-400">
            <div className="loader size-10 after:size-10"></div>
          </div>
        ) : (
          <>
            {activeTab === "general" && (
              <GeneralTab
                onChange={(hasChanges: boolean) => {
                  setHasUnsavedChanges(hasChanges);
                }}
              />
            )}
            {activeTab === "media" && (
              <EditMediaTab
                onChange={(hasChanges: boolean) => {
                  setHasUnsavedChanges(hasChanges);
                }}
              />
            )}
            {activeTab === "location" && (
              <EditLocationTab
                persistedDataKey="get-activity"
                editDataKey="edit-activity"
                onChange={(hasChanges: boolean) => {
                  setHasUnsavedChanges(hasChanges);
                }}
              />
            )}
          </>
        )}
      </div>
    </Layout>
  );
};
