import * as React from "react";
import { Layout } from "../../../../../components/ui";

import { Button } from "../../../../../components";

import { FaDownload } from "react-icons/fa";

import { General } from "./general";
import { Media } from "./media";
import { Location } from "./location";
import { ServiceFeatures } from "./service-features";
import { RentManagement } from "./rent-management";
import { KeyFeatures } from "./key-features";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useGetApi, usePersistentData, useUpdateApi } from "../../../../../hooks";
import { Payload, Property } from "../../../../../types";
import { deleteKeysObject } from "../../../../../utils";

const tabs = ["Rent Management", "General", "Media", "Location", "Service & Features"];

export const EditBuyPage = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  const { mutate: editProperty } = useUpdateApi<Partial<Property>>({ url: "property", key: ["editing-property"], redirectPath: "/dashboard/management/buy" });

  const { data: responseProperty, isLoading } = useGetApi<Payload<Property>>({ url: `property/${params.id}`, key: ["get-property"] });

  const useStore = usePersistentData<Property>("get-property");
  const useEdit = usePersistentData<Property>("edit-property");

  const { setData } = useStore();
  const { data } = useEdit();

  const [activeTab, setActiveTab] = React.useState<string>(() => {
    return sessionStorage.getItem("activeTab") || "Rent Management";
  });

  React.useEffect(() => {
    if (pathname === `/dashboard/management/buy/edit/${params.id}`) {
      sessionStorage.setItem("activeTab", activeTab);
    }

    // Cleanup function that runs when component unmounts or dependencies change
    return () => {
      const isLeavingAddPage = pathname === `/dashboard/management/buy/edit/${params.id}` && window.location.pathname !== `/dashboard/management/buy/edit/${params.id}`;
      if (isLeavingAddPage) {
        const confirmLeave = window.confirm("Are you sure you want to move the page before publish your properties?");
        if (confirmLeave) {
          sessionStorage.clear();
          localStorage.clear();
        } else {
          navigate(`/dashboard/management/buy/edit/${params.id}`);
        }
      }
    };
  }, [pathname, activeTab]);

  React.useEffect(() => {
    if (responseProperty) {
      setData({
        id: responseProperty.data.id,
        name: responseProperty.data.name,
        secondaryName: responseProperty.data.secondaryName,
        price: responseProperty.data.price,
        discountType: responseProperty.data.discountType,
        discount: responseProperty.data.discount,
        priceAfterDiscount: responseProperty.data.priceAfterDiscount,
        ownershipType: responseProperty.data.ownershipType,
        highlight: responseProperty.data.highlight,
        address: responseProperty.data.address,
        country: responseProperty.data.country,
        state: responseProperty.data.state,
        city: responseProperty.data.city,
        postalCode: responseProperty.data.postalCode,
        mapLink: responseProperty.data.mapLink,
        placeNearby: responseProperty.data.placeNearby,
        soldStatus: responseProperty.data.soldStatus,
        photos: responseProperty.data.photos,
        videos: responseProperty.data.videos,
        video360s: responseProperty.data.video360s,
        ownerId: responseProperty.data.ownerId,
        owner: responseProperty.data.owner,
        currencyId: responseProperty.data.currencyId,
        currency: responseProperty.data.currency,
        facilities: responseProperty.data.facilities.map((facility) => ({ id: facility.id, description: facility.description })) as Property["facilities"],
        features: responseProperty.data.features,
        additionals: responseProperty.data.additionals,
      });
    }
  }, [responseProperty]);

  // const handleSaveDraft = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   setData(data);
  // };

  const handlePublish = (e: React.MouseEvent) => {
    e.preventDefault();
    const processData = deleteKeysObject(data, ["currency", "pivotId", "facilities", "priceAfterDiscount", "createdAt", "updatedAt", "id", "reviews"]);
    editProperty({ updatedItem: processData, id: params.id || "" });
  };

  return (
    <Layout>
      {/* Header */}
      <header className="flex items-center justify-between pb-4 mb-6 border-b border-dark/30">
        <h1 className="text-2xl font-bold">{responseProperty?.data.name}</h1>

        <div className="flex items-center gap-4">
          {/* <Button className="flex items-center gap-2 btn-outline">
              <FaFirstdraft /> Save as draft
            </Button> */}
          <Button onClick={handlePublish} className="flex items-center gap-2 btn-primary">
            <FaDownload /> Publish
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

      {isLoading ? (
        <div className="flex items-center justify-center min-h-200">
          <div className="loader size-8 after:size-8"></div>
        </div>
      ) : (
        <div className="bg-light">
          {activeTab === "Rent Management" && <RentManagement />}
          {activeTab === "General" && <General />}
          {activeTab === "Media" && <Media />}
          {activeTab === "Location" && <Location />}
          {activeTab === "Key Features" && <KeyFeatures />}
          {activeTab === "Service & Features" && <ServiceFeatures />}
        </div>
      )}
    </Layout>
  );
};
