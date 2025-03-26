import * as React from "react";
import { Button } from "../../../../../components";

import { FiUpload } from "react-icons/fi";
// import { FaMinus } from "react-icons/fa";
// import { FaRegCheckCircle } from "react-icons/fa";

interface Section {
  id: number;
  title: string;
  name: string;
  description: string;
  photo: File | null;
}

const UploadPhoto = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <h2 className="text-xl font-bold whitespace-nowrap min-w-60">{title}</h2>
        <div className="flex items-center">
          <p className="whitespace-nowrap min-w-60">{description}</p>
          <div className="relative">
            <input type="file" id="images" hidden accept="image/*" multiple />
            <label htmlFor="images" className="file-label">
              <FiUpload /> Browse
            </label>
          </div>
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

export const Media = () => {
  const [sections, setSections] = React.useState<Section[]>([]);

  const addSection = (e: React.MouseEvent) => {
    e.preventDefault();
    const title = prompt("Enter category title:");
    if (title) {
      setSections([
        ...sections,
        {
          id: Date.now(),
          title,
          name: "",
          description: "",
          photo: null,
        },
      ]);
    }
  };

  const deleteSection = (id: number) => {
    setSections(sections.filter((section) => section.id !== id));
  };

  const resetSection = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    setSections(sections.map((section) => (section.id === id ? { ...section, name: "", description: "", photo: null } : section)));
  };

  const handleInputChange = (id: number, field: keyof Section, value: any) => {
    setSections(sections.map((section) => (section.id === id ? { ...section, [field]: value } : section)));
  };

  return (
    <div className="p-8 border rounded-b bg-light border-dark/30">
      <form className="space-y-8">
        {/* Catalog Photo */}
        <UploadPhoto title="Photo" description="Catalog Photo *" />

        {/* Catalog Video */}
        <UploadPhoto title="Video" description="Catalog Video *" />

        {/* 360 Tour */}
        <UploadPhoto title="360 Tour" description="360 Tour *" />

        {/* Additional */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Additional</h2>
            <Button onClick={addSection} className="btn-green">
              + Add More
            </Button>
          </div>
          {sections.map((section) => (
            <div key={section.id} className="pt-2 space-y-2">
              <h2 className="text-lg font-semibold">{section.title}</h2>
              <div key={section.id} className="flex items-center">
                <label className="whitespace-nowrap min-w-60">Name</label>
                <input type="text" placeholder={section.title} value={section.name} onChange={(e) => handleInputChange(section.id, "name", e.target.value)} className="input-text" />
                <label className="px-8 whitespace-nowrap">Description</label>
                <input
                  type="text"
                  placeholder="King bed, Single bed, Bathroom"
                  value={section.description}
                  onChange={(e) => handleInputChange(section.id, "description", e.target.value)}
                  className="input-text"
                />
              </div>
              <div className="flex items-center">
                <label className="whitespace-nowrap min-w-60">Photo</label>
                <div className="relative">
                  <input type="file" onChange={(e) => handleInputChange(section.id, "photo", e.target.files?.[0] || null)} hidden accept="image/*" multiple />
                  <label htmlFor="images" className="file-label">
                    <FiUpload /> Browse
                  </label>
                </div>
                <span className="pl-2 text-sm text-primary whitespace-nowrap">Max. 5mb</span>
              </div>
              <div className="flex items-center gap-4">
                <Button onClick={(e: React.MouseEvent) => resetSection(e, section.id)} className="w-full btn-outline">
                  Reset
                </Button>
                <Button onClick={() => deleteSection(section.id)} className="w-full btn-red">
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-4">
          <Button className="btn-outline">Reset</Button>
          <Button className="btn-primary">Save</Button>
        </div>
      </form>
    </div>
  );
};
