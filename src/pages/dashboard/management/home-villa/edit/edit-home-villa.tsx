import * as React from "react";

import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useGetApi, usePersistentData, useUpdateApi } from "../../../../../hooks";

import { EditKeyFeaturesTab, EditLocationTab, EditMediaTab, EditServiceFeaturesTab, Layout } from "../../../../../components/ui";

import { Button, ToastMessage } from "../../../../../components";

import { FaArrowLeft, FaFileAlt, FaUpload } from "react-icons/fa";

import { GeneralTab } from "./general";
import { ReviewTab } from "./review";
import { VillaPoliciesTab } from "./villa-policies";
import { RentManagementTab } from "./rent-management";

import { OptionType, Payload, Villa } from "../../../../../types";

import { deleteKeysObject, formatTitleCase } from "../../../../../utils";

type TabName = "rent-management" | "general" | "media" | "location" | "key-features" | "service-features" | "villa-policies" | "review";

const tabs: TabName[] = ["rent-management", "general", "media", "location", "key-features", "service-features", "villa-policies", "review"];

export const EditHomeVillaPage = () => {
  const { pathname, hash } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const useStore = usePersistentData<Villa>("get-villa");
  const useEdit = usePersistentData<Villa>("edit-villa");
  const useCurrency = usePersistentData<OptionType>("selected-currency", "localStorage");

  const { setData } = useStore();
  const { setData: setEditData, data, clearData: clearEditDraft } = useEdit();
  const { data: currency } = useCurrency();

  // The draft store is a single global slot, not scoped per villa — if the
  // admin left one villa mid-edit and opened a different one without
  // Publishing or discarding, its stale draft would otherwise leak straight
  // into this villa's form fields (every tab reads from the same store).
  // Tagging the draft with `id` lets every render tell "genuinely this
  // villa's" apart from "leftover from a different one" — including on the
  // very first render, before any effect below has run.
  const isOwnDraft = data.id === id;
  // "edit-villa" only ever holds fields a tab has actually Saved locally —
  // exactly the staged, not-yet-Published changes Publish reads from below.
  const hasDraftContent = isOwnDraft && Object.entries(data).some(([key, value]) => key !== "id" && Boolean(value));

  const [hadRestoredDraft] = React.useState(() => hasDraftContent);

  React.useEffect(() => {
    if (!id) return;
    if (data.id && data.id !== id) {
      clearEditDraft();
    }
    setEditData({ id } as Partial<Villa>);
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

  const { mutate: editVilla, isPending } = useUpdateApi<Partial<Villa>>({ key: ["get-villas"], url: "/villas", redirectPath: "/dashboard/management/home-villa" });

  // currency.value is part of the request, so it must be part of the cache key —
  // otherwise switching currency keeps serving the previously cached villa
  const { data: respVilla, isLoading } = useGetApi<Payload<Villa>>({ url: `villas/${id}`, key: ["get-villa", id, currency.value], params: { baseCurrencyId: currency.value } });

  const [activeTab, setActiveTab] = React.useState<TabName>(() => {
    const hashTab = hash.replace("#", "");
    return tabs.includes(hashTab as TabName) ? (hashTab as TabName) : "rent-management";
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
    if (pathname === `/dashboard/management/home-villa/edit/${id}`) {
      navigate(`${pathname}#${activeTab}`, { replace: true });
    }
  }, [pathname, activeTab, navigate, id]);

  React.useEffect(() => {
    if (respVilla) {
      const { data: responseData } = respVilla;

      setData({
        ...responseData,
        // The API returns relations only as nested objects, but every tab (and
        // the update payload) reads the flat ids. Without this the Owner and
        // Currency dropdowns opened empty on an existing villa, so saving could
        // drop the relation the admin never touched.
        ownerId: responseData.ownerId ?? responseData.owner?.id,
        currencyId: responseData.currencyId ?? responseData.currency?.id,
        // facilities is an optional relation; mapping it unguarded threw inside
        // the effect and left the persisted store empty, so every tab that
        // reads from it rendered nothing
        facilities: (responseData.facilities ?? []).map((facility) => ({
          id: facility.id,
          description: facility.description,
        })) as Villa["facilities"],
      });
    }
  }, [respVilla]);

  const handleNavigateAway = (tab: TabName) => {
    if (tab === activeTab) return;

    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm("You have unsaved changes. Are you sure you want to leave?");
      if (!confirmLeave) {
        return;
      }
    }

    // The flag was never cleared, so once any tab reported changes every later
    // click hit the confirm again — and a browser that has suppressed dialogs
    // returns false without showing one, making the tabs look completely dead.
    // The incoming tab reports its own state on mount.
    setHasUnsavedChanges(false);
    setActiveTab(tab);
  };

  const handlePublish = (e: React.MouseEvent) => {
    e.preventDefault();
    const processData = deleteKeysObject(data, ["currency", "pivotId", "facilities", "priceAfterDiscount", "createdAt", "updatedAt", "id"]);
    // Publish never cleared the local "edit-villa" draft on success, so the
    // "Unpublished changes" banner here — and the Draft ribbon on this villa's
    // card back on the list page, which reads the same store — kept showing
    // after a save that actually went through, looking like it silently failed.
    editVilla({ updatedItem: processData, id: id || "" }, { onSuccess: () => clearEditDraft() });
  };

  return (
    <Layout>
      <header className="flex items-center justify-between pb-4 mb-6 border-b border-dark/30">
        <div className="flex items-center gap-4">
          <Button className="btn-primary" onClick={() => navigate(-1)}>
            <FaArrowLeft size={20} />
          </Button>
          <h1 className="head-title">{respVilla?.data.name}</h1>
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
        {activeTab === "rent-management" && <RentManagementTab />}
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
                persistedDataKey="get-villa"
                editDataKey="edit-villa"
                type="villa"
                onChange={(hasChanges: boolean) => {
                  setHasUnsavedChanges(hasChanges);
                }}
              />
            )}
            {activeTab === "location" && (
              <EditLocationTab
                persistedDataKey="get-villa"
                editDataKey="edit-villa"
                onChange={(hasChanges: boolean) => {
                  setHasUnsavedChanges(hasChanges);
                }}
              />
            )}
            {activeTab === "key-features" && (
              <EditKeyFeaturesTab
                persistedDataKey="get-villa"
                editDataKey="edit-villa"
                onChange={(hasChanges: boolean) => {
                  setHasUnsavedChanges(hasChanges);
                }}
              />
            )}
            {activeTab === "service-features" && (
              <EditServiceFeaturesTab
                persistedDataKey="get-villa"
                editDataKey="edit-villa"
                onChange={(hasChanges: boolean) => {
                  setHasUnsavedChanges(hasChanges);
                }}
              />
            )}
            {activeTab === "villa-policies" && (
              <VillaPoliciesTab
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
