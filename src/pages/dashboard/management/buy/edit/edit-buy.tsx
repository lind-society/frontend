import * as React from "react";

import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useGetApi, usePersistentData, useUpdateApi } from "../../../../../hooks";

import { GeneralTab } from "./general";
import { EditKeyFeaturesTab, EditLocationTab, EditMediaTab, EditServiceFeaturesTab, Layout } from "../../../../../components/ui";
import { Button, ToastMessage } from "../../../../../components";

import { FaArrowLeft, FaFileAlt, FaUpload } from "react-icons/fa";

import { deleteKeysObject, formatTitleCase } from "../../../../../utils";

import { OptionType, Payload, Property } from "../../../../../types";

type TabName = "general" | "media" | "location" | "key-features" | "service-features";

const tabs: TabName[] = ["general", "media", "location", "key-features", "service-features"];

export const EditBuyPage = () => {
  const { pathname, hash } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const useStore = usePersistentData<Property>("get-property");
  const useEdit = usePersistentData<Property>("edit-property");
  const useCurrency = usePersistentData<OptionType>("selected-currency", "localStorage");

  const { setData } = useStore();
  const { setData: setEditData, data, clearData: clearEditDraft } = useEdit();
  const { data: currency } = useCurrency();

  // The draft store is a single global slot, not scoped per property — if the
  // admin left one property mid-edit and opened a different one without
  // Publishing or discarding, its stale draft would otherwise leak straight
  // into this property's form fields (every tab reads from the same store).
  // Tagging the draft with `id` lets every render tell "genuinely this
  // property's" apart from "leftover from a different one" — including on
  // the very first render, before any effect below has run.
  const isOwnDraft = data.id === id;
  // "edit-property" only ever holds fields a tab has actually Saved locally —
  // exactly the staged, not-yet-Published changes Publish reads from below.
  const hasDraftContent = isOwnDraft && Object.entries(data).some(([key, value]) => key !== "id" && Boolean(value));

  const [hadRestoredDraft] = React.useState(() => hasDraftContent);

  React.useEffect(() => {
    if (!id) return;
    if (data.id && data.id !== id) {
      clearEditDraft();
    }
    setEditData({ id } as Partial<Property>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  React.useEffect(() => {
    if (hadRestoredDraft) {
      ToastMessage({ message: "Unpublished changes restored from your last session.", color: "#d97706" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDiscardDraft = () => {
    if (!window.confirm("Discard all unpublished changes and revert every tab back to what's live?")) return;
    clearEditDraft();
    window.location.reload();
  };

  const { mutate: editProperty, isPending } = useUpdateApi<Partial<Property>>({ key: ["get-properties"], url: "/properties", redirectPath: "/dashboard/management/buy" });

  const { data: respProperty, isLoading } = useGetApi<Payload<Property>>({ url: `properties/${id}`, key: ["get-property", id], params: { baseCurrencyId: currency.value } });

  const [activeTab, setActiveTab] = React.useState<TabName>(() => {
    const hashTab = hash.replace("#", "");
    return tabs.includes(hashTab as TabName) ? (hashTab as TabName) : "general";
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
    if (pathname === `/dashboard/management/buy/edit/${id}`) {
      navigate(`${pathname}#${activeTab}`, { replace: true });
    }
  }, [pathname, activeTab, navigate, id]);

  React.useEffect(() => {
    if (respProperty) {
      const { data: responseData } = respProperty;
      setData({
        ...responseData,
        // The API returns relations only as nested objects, but every tab (and
        // the update payload) reads the flat ids — without these the Owner and
        // Currency dropdowns opened empty on an existing property.
        ownerId: responseData.ownerId ?? responseData.owner?.id,
        currencyId: responseData.currencyId ?? responseData.currency?.id,
        // facilities is an optional relation; mapping it unguarded throws inside
        // the effect and leaves the persisted store empty, so every tab that
        // reads from it renders nothing.
        facilities: (responseData.facilities ?? []).map((facility) => ({
          id: facility.id,
          description: facility.description,
        })) as Property["facilities"],
      });
    }
  }, [respProperty]);

  const handleNavigateAway = (tab: TabName) => {
    if (tab === activeTab) return;

    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm("You have unsaved changes. Are you sure you want to leave?");
      if (!confirmLeave) {
        return;
      }
    }

    // Clear the flag on a successful switch. It used to stay true forever, so
    // every later tab click re-triggered the confirm — and a browser with
    // dialogs suppressed returns false silently, freezing the tabs.
    setHasUnsavedChanges(false);
    setActiveTab(tab);
  };

  const handlePublish = (e: React.MouseEvent) => {
    e.preventDefault();
    const processData = deleteKeysObject(data, ["currency", "pivotId", "facilities", "priceAfterDiscount", "createdAt", "updatedAt", "id", "reviews"]);
    editProperty({ updatedItem: processData, id: id || "" });
  };

  return (
    <Layout>
      <header className="flex items-center justify-between pb-4 mb-6 border-b border-dark/30">
        <div className="flex items-center gap-4">
          <Button className="btn-primary" onClick={() => navigate(-1)}>
            <FaArrowLeft size={20} />
          </Button>
          <h1 className="head-title">{respProperty?.data.name}</h1>
          {hasDraftContent && (
            <span className="flex items-center gap-2 px-3 py-1 text-sm text-yellow-800 bg-yellow-200 rounded-full">
              <FaFileAlt size={12} /> Unpublished changes
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          {hasDraftContent && (
            <Button onClick={handleDiscardDraft} className="btn-outline">
              Discard Draft
            </Button>
          )}
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
            {formatTitleCase(tab)}
          </button>
        ))}
      </div>

      <div className="relative p-8 border rounded-b bg-light border-dark/30 min-h-600">
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
                persistedDataKey="get-property"
                editDataKey="edit-property"
                type="property"
                onChange={(hasChanges: boolean) => {
                  setHasUnsavedChanges(hasChanges);
                }}
              />
            )}
            {activeTab === "location" && (
              <EditLocationTab
                persistedDataKey="get-property"
                editDataKey="edit-property"
                onChange={(hasChanges: boolean) => {
                  setHasUnsavedChanges(hasChanges);
                }}
              />
            )}
            {activeTab === "key-features" && (
              <EditKeyFeaturesTab
                persistedDataKey="get-property"
                editDataKey="edit-property"
                onChange={(hasChanges: boolean) => {
                  setHasUnsavedChanges(hasChanges);
                }}
              />
            )}
            {activeTab === "service-features" && (
              <EditServiceFeaturesTab
                persistedDataKey="get-property"
                editDataKey="edit-property"
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
