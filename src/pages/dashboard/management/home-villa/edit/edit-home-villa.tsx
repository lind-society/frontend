import * as React from "react";

import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useGetApi, usePersistentData, useUpdateApi } from "../../../../../hooks";

import { Layout } from "../../../../../components/ui";
import { Button } from "../../../../../components";

import { FaDownload } from "react-icons/fa";

import { General } from "./general";
import { Media } from "./media";
import { Location } from "./location";
import { ServiceFeatures } from "./service-features";
import { VillaPolicies } from "./villa-policies";
import { RentManagement } from "./rent-management";
import { KeyFeatures } from "./key-features";

import { Payload, Villa } from "../../../../../types";

import { deleteKeysObject } from "../../../../../utils";

const tabs = ["Rent Management", "General", "Media", "Location", "Key Features", "Service & Features", "Villa Policies"];

export const EditHomeVillaPage = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const { mutate: editVilla, isPending } = useUpdateApi<Partial<Villa>>({ url: "villas", key: ["editing-villa"], redirectPath: "/dashboard/management/home-villa" });

  const { data: responseVilla, isLoading } = useGetApi<Payload<Villa>>({ url: `villas/${id}`, key: ["get-villa", id] });

  const useStore = usePersistentData<Villa>("get-villa");
  const useEdit = usePersistentData<Villa>("edit-villa");

  const { setData } = useStore();
  const { data } = useEdit();

  const [activeTab, setActiveTab] = React.useState<string>(() => {
    return sessionStorage.getItem("activeTab") || "Rent Management";
  });

  React.useEffect(() => {
    if (pathname === `/dashboard/management/home-villa/edit/${id}`) {
      sessionStorage.setItem("activeTab", activeTab);
    }

    // Cleanup function that runs when component unmounts or dependencies change
    return () => {
      const isLeavingAddPage = pathname === `/dashboard/management/home-villa/edit/${id}` && window.location.pathname !== `/dashboard/management/home-villa/edit/${id}`;
      if (isLeavingAddPage) {
        const confirmLeave = window.confirm("Are you sure you want to move the page before publish your villas?");
        if (confirmLeave) {
          sessionStorage.clear();
          localStorage.clear();
        } else {
          navigate(`/dashboard/management/home-villa/edit/${id}`);
        }
      }
    };
  }, [pathname, activeTab]);

  React.useEffect(() => {
    if (responseVilla) {
      setData({
        id: responseVilla.data.id,
        name: responseVilla.data.name,
        secondaryName: responseVilla.data.secondaryName,
        availability: responseVilla.data.availability,
        priceDaily: responseVilla.data.priceDaily,
        priceMonthly: responseVilla.data.priceMonthly,
        priceYearly: responseVilla.data.priceYearly,
        discountDailyType: responseVilla.data.discountDailyType,
        discountMonthlyType: responseVilla.data.discountMonthlyType,
        discountYearlyType: responseVilla.data.discountYearlyType,
        discountDaily: responseVilla.data.discountDaily,
        discountMonthly: responseVilla.data.discountMonthly,
        discountYearly: responseVilla.data.discountYearly,
        availabilityPerPrice: responseVilla.data.availabilityPerPrice,
        highlight: responseVilla.data.highlight,
        address: responseVilla.data.address,
        country: responseVilla.data.country,
        state: responseVilla.data.state,
        city: responseVilla.data.city,
        postalCode: responseVilla.data.postalCode,
        mapLink: responseVilla.data.mapLink,
        placeNearby: responseVilla.data.placeNearby,
        checkInHour: responseVilla.data.checkInHour,
        checkOutHour: responseVilla.data.checkOutHour,
        photos: responseVilla.data.photos,
        videos: responseVilla.data.videos,
        video360s: responseVilla.data.video360s,
        ownerId: responseVilla.data.ownerId,
        currencyId: responseVilla.data.currencyId,
        currency: responseVilla.data.currency,
        facilities: responseVilla.data.facilities.map((facility) => ({ id: facility.id, description: facility.description })) as Villa["facilities"],
        features: responseVilla.data.features,
        policies: responseVilla.data.policies,
        reviews: responseVilla.data.reviews,
        additionals: responseVilla.data.additionals,
      });
    }
  }, [responseVilla]);

  const handlePublish = (e: React.MouseEvent) => {
    e.preventDefault();
    const processData = deleteKeysObject(data, ["currency", "pivotId", "facilities", "priceAfterDiscount", "createdAt", "updatedAt", "id", "reviews"]);
    editVilla({ updatedItem: processData, id: id || "" });
  };

  return (
    <Layout>
      {/* Header */}
      <header className="flex items-center justify-between pb-4 mb-6 border-b border-dark/30">
        <h1 className="text-2xl font-bold">{responseVilla?.data.name}</h1>

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

      <div className="bg-light">
        {activeTab === "Rent Management" && <RentManagement />}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-200">
            <div className="loader size-16 after:size-16"></div>
          </div>
        ) : (
          <>
            {activeTab === "General" && <General />}
            {activeTab === "Media" && <Media />}
            {activeTab === "Location" && <Location />}
            {activeTab === "Key Features" && <KeyFeatures />}
            {activeTab === "Service & Features" && <ServiceFeatures />}
            {activeTab === "Villa Policies" && <VillaPolicies />}
          </>
        )}
      </div>
    </Layout>
  );
};
