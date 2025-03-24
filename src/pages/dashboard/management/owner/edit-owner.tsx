import { FiUpload } from "react-icons/fi";
import { Button } from "../../../../components";

import { Layout } from "../../../../components/ui";
import { useNavigate } from "react-router-dom";

const UploadPhoto = ({ title }: { title: string }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <h2 className="block whitespace-nowrap min-w-60">{title}</h2>
        <div className="flex items-center">
          <input type="file" id="images" hidden accept="image/*" multiple />
          <label htmlFor="images" className="file-label">
            <FiUpload /> Browse
          </label>
          <span className="pl-2 text-sm text-primary whitespace-nowrap">Max. 5mb</span>
        </div>
      </div>
      {/* <small className="flex items-center w-full gap-2 px-4 py-2 bg-green-600 rounded text-light">
            <FaRegCheckCircle size={20} /> Upload Success!
            </small>
            <div className="grid grid-cols-4 gap-2">
            {["/temp.png", "/temp.png", "/temp.png"].map((image, index) => (
            <div key={index} className="relative">
            <button type="button" className="absolute flex items-center justify-center w-5 h-5 rounded-full -top-2 -right-2 z-1 bg-secondary">
            <FaMinus className="fill-light" />
            </button>
            <Img src={image || "/temp-business.webp"} alt={`Selected image ${index + 1}`} className="w-full h-48 rounded" />
            </div>
            ))}
            </div> */}
    </div>
  );
};

export const EditOwnerPage = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <header className="flex items-center justify-between pb-4 mb-6 border-b border-dark/20">
        <h1 className="text-2xl font-bold">Edit Booking</h1>

        <Button onClick={() => navigate("/dashboard/management/owner")} className="btn-outline">
          Close
        </Button>
      </header>

      <div className="p-8 border rounded-b bg-light border-dark/20">
        <h2 className="heading">Edit Owner Data</h2>

        <form className="mt-6 space-y-8">
          {/* Property name */}
          <div className="flex items-center">
            <label className="block whitespace-nowrap min-w-60">Full Name *</label>
            <input type="text" className="input-text" placeholder="Asya Faris" />
          </div>
          <div className="flex items-center">
            <label className="block whitespace-nowrap min-w-60">NIK / Passport *</label>
            <input type="text" className="input-text" placeholder="3587984651320003" />
          </div>
          <div className="flex items-center">
            <label className="block whitespace-nowrap min-w-60">Email *</label>
            <input type="email" className="input-text" placeholder="asyafaris@gmail.com" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center w-full">
              <label className="block whitespace-nowrap min-w-60">Phone Number *</label>
              <select className="w-full input-select">
                <option value="">+62</option>
                <option value="">+52</option>
                <option value="">+78</option>
              </select>
            </div>

            <input type="text" className="w-full max-w-lg input-text" placeholder="+62894613831" readOnly />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center w-full">
              <label className="block whitespace-nowrap min-w-60">Whatsapp Number *</label>
              <select className="w-full input-select">
                <option value="">+62</option>
                <option value="">+52</option>
                <option value="">+78</option>
              </select>
            </div>

            <input type="text" className="w-full max-w-lg input-text" placeholder="+62894613831" readOnly />
          </div>

          <h2 className="heading">Photo</h2>

          <UploadPhoto title="Profile Photo *" />
          <UploadPhoto title="ID Photo *" />

          {/* Save and Cancel Buttons */}
          <div className="flex justify-end gap-4">
            <Button className="btn-outline">Reset</Button>
            <Button className="btn-primary">Save</Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};
