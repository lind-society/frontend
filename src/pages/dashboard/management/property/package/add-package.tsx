import * as React from "react";

import { useCreateApi, useGetApiWithAuth } from "../../../../../hooks";

import Select from "react-select";
import { Layout } from "../../../../../components/ui";
import { Button } from "../../../../../components";

import { FaPlus } from "react-icons/fa";

import { Data, OptionType, Payload } from "../../../../../types";

interface PackageFormItem {
  id: string;
  benefit: OptionType | null;
}

export const AddPackagePage = () => {
  const [packageName, setPackageName] = React.useState("");
  const [packageDescription, setPackageDescription] = React.useState("");
  const [packageBenefits, setPackageBenefits] = React.useState<PackageFormItem[]>([]);

  const { data: benefitsResponse, isLoading } = useGetApiWithAuth<Payload<Data<{ id: string; title: string }[]>>>({
    key: ["get-benefits"],
    url: "package-benefits",
    params: { limit: "20" },
  });

  const { mutate: addPackage, isPending } = useCreateApi({ key: ["add-package"], url: "packages" });

  const benefitOptions = React.useMemo(() => {
    return benefitsResponse?.data?.data.map((benefit) => ({ value: benefit.id, label: benefit.title })) || [];
  }, [benefitsResponse]);

  const addBenefit = () => {
    const newItem: PackageFormItem = { id: `benefit-${Date.now()}`, benefit: null };
    setPackageBenefits((prev) => [newItem, ...prev]);
  };

  const updateBenefit = (id: string, option: OptionType | null) => {
    setPackageBenefits((prev) => prev.map((item) => (item.id === id ? { ...item, benefit: option } : item)));
  };

  const resetBenefit = (id: string) => {
    setPackageBenefits((prev) => prev.map((item) => (item.id === id ? { ...item, benefit: null } : item)));
  };

  const removeBenefit = (id: string) => {
    if (!window.confirm("Are you sure you want to remove this benefit?")) return;
    setPackageBenefits((prev) => prev.filter((item) => item.id !== id));
  };

  const resetForm = () => {
    const newItem: PackageFormItem = { id: `benefit-${Date.now()}`, benefit: null };
    setPackageName("");
    setPackageDescription("");
    setPackageBenefits(() => [newItem]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSave = {
      name: packageName,
      description: packageDescription,
      benefits: packageBenefits.map((item) => item.benefit?.value),
    };

    addPackage(dataToSave);
  };

  React.useEffect(() => {
    if (packageBenefits.length === 0 && !isLoading) {
      addBenefit();
    }
  }, [isLoading]);

  return (
    <Layout>
      {/* Header */}
      <header className="flex items-center justify-between pb-4 mb-6 border-b border-dark/30">
        <h1 className="text-2xl font-bold">Property Management</h1>
      </header>

      <div className="p-8 border rounded-b bg-light border-dark/30">
        <h2 className="heading">General</h2>

        <form className="mt-6 space-y-8" onSubmit={handleSubmit}>
          {/* Property name */}
          <div className="flex items-center">
            <label htmlFor="package-name" className="block whitespace-nowrap min-w-60">
              Name*
            </label>
            <input id="package-name" type="text" className="input-text" placeholder="Online Marketing" value={packageName} onChange={(e) => setPackageName(e.target.value)} required />
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
              value={packageDescription}
              onChange={(e) => setPackageDescription(e.target.value)}
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
              {packageBenefits.map((item) => (
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
