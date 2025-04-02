import { useNavigate } from "react-router-dom";

import { Layout } from "../../../../../components/ui";
import { Button } from "../../../../../components";

import { FaDownload } from "react-icons/fa";

export const AddPackagePage = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Header */}
      <header className="flex items-center justify-between pb-4 mb-6 border-b border-dark/30">
        <h1 className="text-2xl font-bold">Property Management</h1>

        <Button onClick={() => navigate("/dashboard/management/property/add")} className="flex items-center gap-2 btn-primary">
          <FaDownload /> Publish
        </Button>
      </header>
      <div className="p-8 border rounded-b bg-light border-dark/30">
        <h2 className="heading">General</h2>

        <form className="mt-6 space-y-8">
          {/* Property name */}
          <div className="flex items-center">
            <label className="block whitespace-nowrap min-w-60">Packing name*</label>
            <input type="text" className="input-text" placeholder="Online Marketing" />
          </div>
          <div className="flex items-center">
            <label className="block whitespace-nowrap min-w-60">Description</label>
            <input type="text" className="input-text" placeholder="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veritatis, vel?" />
          </div>

          <div className="flex justify-end gap-4">
            <Button className="btn-outline">Reset</Button>
            <Button className="btn-primary">Save</Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};
