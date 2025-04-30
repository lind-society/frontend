import * as React from "react";
import { useNavigate, useBeforeUnload } from "react-router-dom";
import { useCreateApi, useGetApiWithAuth } from "../../../../../hooks";
import Select from "react-select";
import { Layout } from "../../../../../components/ui";
import { Button } from "../../../../../components";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { Benefit, Data, OptionType, Package, Payload } from "../../../../../types";

interface PackageFormItem {
  id: string;
  benefit: OptionType | null;
}

// Merged state interface to hold all form fields
interface PackageFormState {
  packageName: string;
  packageDescription: string;
  packageBenefits: PackageFormItem[];
}

export const AddPackagePage = () => {
  const navigate = useNavigate();

  // Create a single state object for the form
  const [formState, setFormState] = React.useState<PackageFormState>({
    packageName: "",
    packageDescription: "",
    packageBenefits: [],
  });

  const [isDirty, setIsDirty] = React.useState<boolean>(false);

  const { data: respBenefits, isLoading } = useGetApiWithAuth<Payload<Data<Benefit[]>>>({ key: ["get-benefits"], url: "/package-benefits", params: { limit: "20" } });

  const { mutate: addPackage, isPending } = useCreateApi<Partial<Package>>({ key: ["add-package"], url: "/packages", redirectPath: `/dashboard/management/property/package/add` });

  const benefitOptions = React.useMemo(() => {
    return respBenefits?.data?.data.map((benefit) => ({ value: benefit.id, label: benefit.title })) || [];
  }, [respBenefits]);

  const updateFormField = <K extends keyof PackageFormState>(field: K, value: PackageFormState[K]) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const addBenefit = () => {
    const newItem: PackageFormItem = { id: crypto.randomUUID(), benefit: null };
    updateFormField("packageBenefits", [newItem, ...formState.packageBenefits]);
  };

  const updateBenefit = (id: string, option: OptionType | null) => {
    const updatedBenefits = formState.packageBenefits.map((item) => (item.id === id ? { ...item, benefit: option } : item));
    updateFormField("packageBenefits", updatedBenefits);
  };

  const resetBenefit = (id: string) => {
    const updatedBenefits = formState.packageBenefits.map((item) => (item.id === id ? { ...item, benefit: null } : item));
    updateFormField("packageBenefits", updatedBenefits);
  };

  const removeBenefit = (id: string) => {
    if (!window.confirm("Are you sure you want to remove this benefit?")) return;
    const updatedBenefits = formState.packageBenefits.filter((item) => item.id !== id);
    updateFormField("packageBenefits", updatedBenefits);
  };

  const resetForm = () => {
    const newItem: PackageFormItem = { id: crypto.randomUUID(), benefit: null };
    setFormState({
      packageName: "",
      packageDescription: "",
      packageBenefits: [newItem],
    });
    setIsDirty(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = {
      name: formState.packageName,
      description: formState.packageDescription,
      benefits: formState.packageBenefits.map((item) => ({ id: item.benefit?.value || "" })) as Package["benefits"],
    };
    setIsDirty(false);
    addPackage(dataToSave);
  };

  useBeforeUnload(
    React.useCallback(
      (event) => {
        if (isDirty) event.preventDefault();
      },
      [isDirty]
    )
  );

  const handleNavigation = (to: number) => {
    if (isDirty) {
      const confirmed = window.confirm("You have unsaved changes. Are you sure you want to leave?");
      if (confirmed) {
        navigate(to);
      }
    } else {
      navigate(to);
    }
  };

  React.useEffect(() => {
    if (!isLoading && formState.packageBenefits.length === 0) {
      setFormState((prev) => ({ ...prev, packageBenefits: [{ id: crypto.randomUUID(), benefit: null }] }));
    }
  }, [isLoading, formState.packageBenefits.length]);

  return (
    <Layout>
      <header className="flex items-center gap-4 pb-4 mb-6 border-b border-dark/30">
        <Button className="btn-primary" onClick={() => handleNavigation(-1)}>
          <FaArrowLeft size={20} />
        </Button>
        <h1 className="head-title">Add Package</h1>
      </header>

      <div className="p-8 border rounded-b bg-light border-dark/30">
        <h2 className="heading">General</h2>

        <form className="mt-6 space-y-8" onSubmit={handleSubmit}>
          <div className="flex items-center">
            <label htmlFor="package-name" className="block whitespace-nowrap min-w-60">
              Name*
            </label>
            <input
              id="package-name"
              type="text"
              className="input-text"
              placeholder="Online Marketing"
              value={formState.packageName}
              onChange={(e) => updateFormField("packageName", e.target.value)}
              required
            />
          </div>

          <div className="flex items-center">
            <label htmlFor="package-description" className="block whitespace-nowrap min-w-60">
              Description*
            </label>
            <input
              id="package-description"
              type="text"
              className="input-text"
              placeholder="Brief description of the package"
              value={formState.packageDescription}
              onChange={(e) => updateFormField("packageDescription", e.target.value)}
              required
            />
          </div>

          <div className="mb-8 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="heading">Benefits</h2>
              <Button type="button" onClick={addBenefit} className="flex items-center gap-2 btn-primary">
                <FaPlus /> Add Benefit
              </Button>
            </div>

            <div className="space-y-8">
              {formState.packageBenefits.map((item) => (
                <div key={item.id} className="space-y-2">
                  <div className="flex items-center">
                    <label className="block whitespace-nowrap min-w-60">Title</label>
                    <Select
                      className="w-full text-sm"
                      options={benefitOptions}
                      value={item.benefit}
                      onChange={(option) => updateBenefit(item.id, option)}
                      placeholder="Select Benefit"
                      isLoading={isLoading}
                      isClearable
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button type="button" onClick={() => resetBenefit(item.id)} className="w-full btn-outline">
                      Reset
                    </Button>
                    <Button type="button" onClick={() => removeBenefit(item.id)} className="w-full btn-red">
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" onClick={resetForm} className="btn-outline">
              Reset
            </Button>
            <Button type="submit" className={`btn-primary ${isPending && "animate-pulse"}`}>
              Save
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};
