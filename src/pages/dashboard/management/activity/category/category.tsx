import * as React from "react";

import { useNavigate } from "react-router-dom";

import { useCreateApi, useDeleteApi, useGetApi } from "../../../../../hooks";

import { Layout } from "../../../../../components/ui";
import { Button, Modal } from "../../../../../components";

import { FaArrowLeft, FaRegTrashAlt } from "react-icons/fa";

import { Category, Data, Payload } from "../../../../../types";

export const ActivityCategoryPage = () => {
  const navigate = useNavigate();

  const [name, setName] = React.useState<string>("");
  const [deleteModal, setDeleteModal] = React.useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null);

  const { data: respCategories, isLoading } = useGetApi<Payload<Data<Category[]>>>({ key: ["get-activity-categories"], url: "activity-categories", params: { limit: "100" } });

  const { mutate: addCategory, isPending: isAdding } = useCreateApi<{ name: string }>({ key: ["get-activity-categories"], url: "/activity-categories" });
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteApi({ key: ["get-activity-categories"], url: "/activity-categories" });

  const categories = respCategories?.data.data || [];

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addCategory({ name: name.trim() }, { onSuccess: () => setName("") });
  };

  const openDeleteModal = (category: Category) => {
    setSelectedCategory(category);
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
    setSelectedCategory(null);
  };

  const handleDeleteCategory = (e: React.MouseEvent) => {
    e.preventDefault();
    if (selectedCategory?.id) {
      deleteCategory(selectedCategory.id);
      setDeleteModal(false);
    }
  };

  return (
    <Layout>
      <header className="flex items-center gap-4 pb-4 mb-6 border-b border-dark/30">
        <Button className="btn-primary" onClick={() => navigate("/dashboard/management/activity")}>
          <FaArrowLeft size={20} />
        </Button>
        <h1 className="head-title">Activity Categories</h1>
      </header>

      <div className="p-8 border rounded-b bg-light border-dark/30">
        <h2 className="heading">Add Category</h2>
        <form className="flex items-center gap-4 mt-6" onSubmit={handleAddCategory}>
          <input type="text" className="input-text" placeholder="e.g. Adventure" value={name} onChange={(e) => setName(e.target.value)} required />
          <Button type="submit" className={`btn-primary whitespace-nowrap ${isAdding && "animate-pulse"}`}>
            Add Category
          </Button>
        </form>
      </div>

      <div className="p-8 mt-8 border rounded-b bg-light border-dark/30">
        <h2 className="heading">All Categories</h2>

        {isLoading ? (
          <div className="flex justify-center min-h-200">
            <div className="loader size-12 after:size-12"></div>
          </div>
        ) : categories.length === 0 ? (
          <p className="p-4 text-center text-dark/50">No categories added yet. Add one above to use it when creating an activity.</p>
        ) : (
          <div className="mt-6 space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-4 border rounded border-dark/30">
                <span className="font-medium text-primary">{category.name}</span>
                <button onClick={() => openDeleteModal(category)} className="p-2 text-sm bg-red-500 rounded-full hover:bg-red-600 text-light">
                  <FaRegTrashAlt />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal onClose={closeDeleteModal} isVisible={deleteModal}>
        <h2 className="heading">Delete Category</h2>
        <p className="mt-2 mb-6">
          Are you sure you want to delete "{selectedCategory?.name}"? Activities using it will be left without a category.
        </p>
        <div className="flex justify-end">
          <Button type="submit" className={`btn-red ${isDeleting && "animate-pulse"}`} onClick={handleDeleteCategory}>
            Delete
          </Button>
        </div>
      </Modal>
    </Layout>
  );
};
