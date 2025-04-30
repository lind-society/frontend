import * as React from "react";

import { Link, useNavigate } from "react-router-dom";

import { useDeleteApi, useGetApi, useSearchPagination } from "../../../../hooks";

import { Layout, SearchBox } from "../../../../components/ui";
import { Button, Img, Modal, Pagination } from "../../../../components";

import { FaPlus, FaRegTrashAlt } from "react-icons/fa";

import { Activity, Data, Payload } from "../../../../types";
import { capitalize } from "../../../../utils";

interface CardContentProps {
  isLoading: boolean;
  activities: Activity[];
  openDeleteModal: (data: any) => void;
}

const CardContent = ({ isLoading, activities, openDeleteModal }: CardContentProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center min-h-400">
        <div className="loader size-12 after:size-12"></div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-400">
        <span className="text-4xl font-bold text-dark/50">Activities not found</span>
      </div>
    );
  }

  const defaultImage = "/images/modern-villa-background.webp";

  return (
    <div className="flex flex-wrap gap-4 xl:gap-10 2xl:gap-4">
      {activities.map((activity) => (
        <div key={activity.id} className="w-full card-shadow max-w-72">
          <div className="relative w-full">
            <button onClick={() => openDeleteModal(activity)} className="absolute p-2 text-sm bg-red-500 rounded-full top-2 right-2 hover:bg-red-600 text-light z-1">
              <FaRegTrashAlt />
            </button>
            <Img src={activity.photos && activity.photos.length > 0 ? activity.photos[0] : defaultImage} alt={activity.name} className="object-cover w-full h-60" />
          </div>
          <div className="text-primary bg-light">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-dark/30">
              <p className="font-medium line-clamp-1">{`${capitalize(activity.state)} - ${capitalize(activity.country)}`}</p>
              <p className="px-4 py-1 text-sm rounded bg-primary text-light">{activity.category.name}</p>
            </div>
            <div className="p-4 space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <Link to={`/dashboard/management/activity/edit/${activity.id}`} className="block text-xl">
                  <h2 className="h-20 font-semibold line-clamp-3">{activity.name}</h2>
                </Link>
                <div className="font-bold text-end">
                  <p className="text-lg font-bold whitespace-nowrap">
                    {activity.currency.code} {activity.price}
                  </p>
                  <p className="text-sm font-light">/session</p>
                </div>
              </div>
              <p className="text-sm text-justify line-clamp-6">{activity.highlight}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const ActivityPage = () => {
  const navigate = useNavigate();

  const [deleteModal, setDeleteModal] = React.useState<boolean>(false);
  const [selectedActivity, setSelectedActivity] = React.useState<Activity | null>(null);

  const { searchQuery, inputValue, setInputValue, handleSearch, currentPage, handlePageChange } = useSearchPagination();

  const { data: respActivities, isLoading } = useGetApi<Payload<Data<Activity[]>>>({
    key: ["get-activities", searchQuery, currentPage],
    url: "activities",
    params: { search: searchQuery, page: currentPage },
  });
  const { mutate: deleteActivity, isPending } = useDeleteApi({ key: ["delete-activity"], url: "/activities", redirectPath: "/dashboard/management/home-villa" });

  const activities = respActivities?.data.data || [];
  const totalPages = respActivities?.data.meta.totalPages || 1;

  const handleDeleteActivity = (e: React.MouseEvent) => {
    e.preventDefault();
    if (selectedActivity?.id) {
      deleteActivity(selectedActivity.id);
      setDeleteModal(false);
    }
  };

  const openDeleteModal = (activity: Activity) => {
    setSelectedActivity(activity);
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
    setSelectedActivity(null);
  };

  return (
    <Layout>
      {/* Header */}
      <header className="flex items-center justify-between pb-4 mb-6 border-b border-dark/30">
        <h1 className="head-title">Activities Management</h1>

        <Button onClick={() => navigate("/dashboard/management/activity/add")} className="flex items-center gap-2 btn-primary">
          <FaPlus /> Add New
        </Button>
      </header>

      <div className="space-y-8">
        <SearchBox value={inputValue} onChange={setInputValue} onSearch={handleSearch} />

        <CardContent isLoading={isLoading} openDeleteModal={openDeleteModal} activities={activities} />

        <Pagination page={currentPage} setPage={handlePageChange} totalPage={totalPages} isNumbering />
      </div>

      <Modal onClose={closeDeleteModal} isVisible={deleteModal}>
        <h2 className="heading">Delete Activity Data</h2>
        <p className="mt-2 mb-6">Are you sure you want to delete this activity "{selectedActivity?.name}"?</p>
        <div className="flex justify-end">
          <Button type="submit" className={`btn-red ${isPending && "animate-pulse"}`} onClick={handleDeleteActivity}>
            Delete
          </Button>
        </div>
      </Modal>
    </Layout>
  );
};
