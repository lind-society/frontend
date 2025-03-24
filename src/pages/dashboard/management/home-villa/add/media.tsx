import * as React from "react";

import "@photo-sphere-viewer/markers-plugin/index.css";

import { useCreateApi, usePersistentData, useUploads } from "../../../../../hooks";

import { Button, Img, UploadPhoto } from "../../../../../components";

import { FaPlus, FaUpload } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";

import { FileData, Payload, Villa } from "../../../../../types";
import { capitalize } from "../../../../../utils";

interface Section {
  title: string;
  field: {
    id: string;
    name: string;
    description: string;
    photos: string[];
    photosURLView: string[];
  }[];
}

const initAdditional = ["Bedrooms", "Outdoor Areas", "Indoor Areas", "More Pictures"].map((title) => ({
  title,
  field: [{ id: crypto.randomUUID(), description: "", name: "", photos: [], photosURLView: [] }],
}));

export const Media = () => {
  const useStore = usePersistentData<Partial<Villa>>("add-villa");
  const { setData, data } = useStore();

  const defaultAdditional = data.additionals?.map((additional) => ({
    title: capitalize(additional.type),
    field: [{ id: crypto.randomUUID(), description: additional.description, name: additional.name, photos: additional.photos, photosURLView: [] }],
  }));

  const [additional, setAdditional] = React.useState<Section[]>(defaultAdditional || initAdditional);

  const [photos, setPhotos] = React.useState<string[]>([]);
  const [videos, setVideos] = React.useState<string[]>([]);
  const [video360s, setVideo360s] = React.useState<string[]>([]);

  const { uploadFile } = useUploads<Payload<FileData>>();
  const { mutate: deleteFile } = useCreateApi("storages", ["photoAdditional"]);

  // add field of sections
  const addField = (e: React.MouseEvent, additionalIndex: number) => {
    e.preventDefault();
    setAdditional((prevAdditional) =>
      prevAdditional.map((section, index) =>
        index === additionalIndex
          ? {
              ...section,
              field: [...section.field, { id: crypto.randomUUID(), name: "", description: "", photos: [], photosURLView: [] }],
            }
          : section
      )
    );
  };

  // delete field of sections
  const deleteField = (additionalIndex: number, fieldId: string) => {
    if (additional[additionalIndex].field.length <= 1) return;

    if (!window.confirm("Are you sure you want to delete?")) return;

    setAdditional((prevAdditional) => prevAdditional.map((section, index) => (index === additionalIndex ? { ...section, field: section.field.filter((field) => field.id !== fieldId) } : section)));
  };

  // reset field of sections
  const resetField = (e: React.MouseEvent, additionalIndex: number, fieldId: string) => {
    e.preventDefault();
    setAdditional((prevAdditional) =>
      prevAdditional.map((section, index) =>
        index === additionalIndex
          ? { ...section, field: section.field.map((field) => (field.id === fieldId ? { ...field, name: "", description: "", photos: [], photosURLView: [] } : field)) }
          : section
      )
    );
  };

  // handle input text name or description inside field
  const handleInputChange = (additionalIndex: number, fieldId: string, fieldName: "name" | "description", value: any) => {
    setAdditional((prevSections) =>
      prevSections.map((section, index) =>
        index === additionalIndex ? { ...section, field: section.field.map((field) => (field.id === fieldId ? { ...field, [fieldName]: value } : field)) } : section
      )
    );
  };

  // handle input file change inside field
  const handleFileInputChange = async (additionalIndex: number, fieldId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];

    const { response } = await uploadFile(files!, "villa", "photos");

    const viewFiles = files.map((file) => URL.createObjectURL(file));

    if (response) {
      setAdditional((prevSections) =>
        prevSections.map((section, sIndex) =>
          sIndex === additionalIndex
            ? {
                ...section,
                field: section.field.map((field) =>
                  field.id === fieldId ? { ...field, photos: [...field.photos, ...response.data.successFiles.map((file) => file.url)], photosURLView: [...field.photosURLView, ...viewFiles] } : field
                ),
              }
            : section
        )
      );
    }
  };

  // remove image inside field
  const removeImage = async (additionalIndex: number, fieldId: string, imgIndex: number) => {
    if (!window.confirm("Are you sure you want to remove?")) return;

    deleteFile({ key: additional[additionalIndex].field.find((item) => item.id === fieldId)?.photos[imgIndex] });

    setAdditional((prevSections) =>
      prevSections.map((section, sIndex) =>
        sIndex === additionalIndex
          ? {
              ...section,
              field: section.field.map((field) =>
                field.id === fieldId ? { ...field, photos: field.photos.filter((_, index) => index !== imgIndex), photosURLView: field.photosURLView.filter((_, index) => index !== imgIndex) } : field
              ),
            }
          : section
      )
    );
  };

  const handleSubmitMedia = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedData: Partial<Villa> = {
      additionals: additional.flatMap((section) =>
        section.field
          .filter((field) => field.name !== "" && field.description !== "" && field.photos.length > 0)
          .map((field) => ({
            name: field.name,
            type: section.title.toLowerCase(),
            description: field.description,
            photos: field.photos,
          }))
      ) as Villa["additionals"],
      photos,
      videos,
      video360s,
    };
    setData(formattedData);
  };

  return (
    <div className="p-8 border rounded-b bg-light border-dark/20">
      <form className="space-y-8" onSubmit={handleSubmitMedia}>
        {/* Catalog Photo */}
        <UploadPhoto type="photos" title="Photo" description="Catalog Photo *" fileUrl={photos} setFileUrl={setPhotos} />

        {/* Catalog Video */}
        <UploadPhoto type="videos" title="Video" description="Catalog Video *" fileUrl={videos} setFileUrl={setVideos} />

        {/* 360 Tour */}
        <UploadPhoto type="video360s" title="360 Tour" description="360 Tour *" fileUrl={video360s} setFileUrl={setVideo360s} />

        {/* Additional Sections */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Additional</h2>
          </div>
          <div className="space-y-8">
            {additional.map((section, additionalIndex) => (
              <div key={additionalIndex} className="pt-2 space-y-4">
                <h2 className="text-lg font-semibold">{section.title}</h2>
                {section.field.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <div className="flex items-center">
                      <label className="whitespace-nowrap min-w-60">Name</label>
                      <input type="text" placeholder={section.title} value={field.name} onChange={(e) => handleInputChange(additionalIndex, field.id, "name", e.target.value)} className="input-text" />
                      <label className="px-8 whitespace-nowrap">Description</label>
                      <input
                        type="text"
                        placeholder="King bed, Single bed, Bathroom"
                        value={field.description}
                        onChange={(e) => handleInputChange(additionalIndex, field.id, "description", e.target.value)}
                        className="input-text"
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="whitespace-nowrap min-w-60">Photo</label>
                      <div className="relative">
                        <input type="file" id={field.name} onChange={(e) => handleFileInputChange(additionalIndex, field.id, e)} hidden accept="image/*" multiple />
                        <label htmlFor={field.name} className="file-label">
                          <FaUpload /> Browse
                        </label>
                      </div>
                      <span className="pl-2 text-sm text-primary whitespace-nowrap">Max. 5mb</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[...field.photos, ...field.photosURLView].map((image, index) => (
                        <div key={index} className="relative">
                          <button
                            onClick={() => removeImage(additionalIndex, field.id, index)}
                            type="button"
                            className="absolute flex items-center justify-center w-5 h-5 rounded-full -top-2 -right-2 z-1 bg-secondary"
                          >
                            <IoCloseOutline className="text-light" />
                          </button>
                          <Img src={image || "/temp-business.webp"} alt={`Selected image ${index + 1}`} className="w-full h-48 rounded" />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-4">
                      <Button type="button" onClick={(e: React.MouseEvent) => resetField(e, additionalIndex, field.id)} className="w-full btn-outline">
                        Reset
                      </Button>
                      <Button type="button" onClick={() => deleteField(additionalIndex, field.id)} className="w-full btn-red">
                        Delete
                      </Button>
                      <Button type="button" onClick={(e: React.MouseEvent) => addField(e, additionalIndex)} className="flex items-center justify-center w-full gap-2 btn-primary">
                        <FaPlus /> Add More
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button type="submit" className="btn-primary">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};
