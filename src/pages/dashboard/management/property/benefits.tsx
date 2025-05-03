import * as React from "react";

import { useCreateApi, useGetApiWithAuth, useUpdateApi, useDeleteApi } from "../../../../hooks";

import { Button } from "../../../../components";

import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";

import { Benefit, Data, Payload } from "../../../../types";
import { IoIosSave } from "react-icons/io";

export const BenefitsTab = () => {
  const [formState, setFormState] = React.useState<Benefit[]>([]);
  const [isEditing, setIsEditing] = React.useState<Record<string, boolean>>({});

  const { data: respBenefits, isLoading, refetch } = useGetApiWithAuth<Payload<Data<Benefit[]>>>({ key: ["get-benefits"], url: "/package-benefits", params: { limit: "100" } });
  const { mutate: createBenefit, isPending: isCreating } = useCreateApi<Partial<Benefit>>({ key: ["add-benefit"], url: "/package-benefits" });
  const { mutate: updateBenefit, isPending: isUpdating } = useUpdateApi<Partial<Benefit>>({ key: ["update-benefit"], url: "/package-benefits" });
  const { mutate: deleteBenefit, isPending: isDeleting } = useDeleteApi({ key: ["delete-benefit"], url: "/package-benefits" });

  React.useEffect(() => {
    if (respBenefits?.data?.data) {
      setFormState(respBenefits.data.data);
    }
  }, [respBenefits]);

  const addBenefit = () => {
    const newBenefit: Benefit & { isTemp?: boolean } = {
      id: `temp-${crypto.randomUUID()}`,
      title: "",
      isTemp: true,
    };

    setFormState((prev) => [...prev, newBenefit]);
    setIsEditing((prev) => ({ ...prev, [newBenefit.id]: true }));
  };

  const resetBenefit = () => {
    if (respBenefits) {
      setFormState(respBenefits.data.data);
      setIsEditing({});
    }
  };

  const removeBenefit = (id: string) => {
    if (!window.confirm("Are you sure you want to remove this benefit?")) return;

    if (id.startsWith("temp-")) {
      setFormState((prev) => prev.filter((item) => item.id !== id));
      return;
    }

    deleteBenefit(id);

    setTimeout(() => {
      refetch();
    }, 500);
  };

  const handleBenefitChange = (id: string, value: string) => {
    setFormState((prev) => prev.map((item) => (item.id === id ? { ...item, title: value } : item)));
  };

  const toggleEditing = (id: string) => {
    setIsEditing((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const saveBenefit = (id: string, benefit: Benefit & { isTemp?: boolean }) => {
    if (benefit.isTemp) {
      createBenefit({ title: benefit.title });
      setIsEditing((prev) => ({ ...prev, [id]: !prev[id] }));
    } else {
      updateBenefit({ id: benefit.id, updatedItem: { title: benefit.title } });
      setIsEditing((prev) => ({ ...prev, [id]: !prev[id] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const benefitsToSave = formState.filter((benefit) => isEditing[benefit.id]);

    benefitsToSave.forEach((benefit) => {
      saveBenefit(benefit.id, benefit);
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center min-h-400">
        <div className="loader size-12 after:size-12"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h2 className="heading">Benefits</h2>
        <Button type="button" onClick={addBenefit} className="flex items-center gap-2 btn-primary">
          <FaPlus /> Add Benefit
        </Button>
      </div>
      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="space-y-4">
          {formState.length === 0 && <div className="p-4 text-center text-dark/50">No benefits added yet. Click "Add Benefit" to create one.</div>}

          {formState.map((benefit, index) => (
            <div key={benefit.id} className="flex items-center w-full gap-8">
              <div className="flex items-center w-full gap-4 benefits-center">
                <label htmlFor={`title-${benefit.id}`} className="block font-medium whitespace-nowrap min-w-60">
                  Benefit {index + 1} *
                </label>
                <input
                  id={`title-${benefit.id}`}
                  type="text"
                  className="w-full input-text"
                  placeholder="Enter benefit title"
                  value={benefit.title}
                  onChange={(e) => handleBenefitChange(benefit.id, e.target.value)}
                  readOnly={!isEditing[benefit.id]}
                  required
                />
              </div>

              <div className="flex gap-4">
                {isEditing[benefit.id] && (
                  <button type="button" onClick={() => saveBenefit(benefit.id, benefit)} disabled={isCreating || isUpdating} className="text-blue-500">
                    <IoIosSave className={isCreating || isUpdating ? "animate-pulse" : ""} size={20} />
                  </button>
                )}
                <button type="button" onClick={() => toggleEditing(benefit.id)}>
                  <FaEdit size={20} />
                </button>
                <button type="button" onClick={() => removeBenefit(benefit.id)} disabled={isDeleting} className="text-red-500">
                  <FaTrash className={isDeleting ? "animate-pulse" : ""} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" onClick={resetBenefit} className="btn-outline">
            Reset
          </Button>
          <Button type="submit" className={`btn-primary ${(isCreating || isUpdating) && "animate-pulse"}`} disabled={isCreating || isUpdating}>
            Save All Changes
          </Button>
        </div>
      </form>
    </>
  );
};
