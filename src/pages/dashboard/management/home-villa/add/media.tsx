import * as React from "react";

import { useUploads } from "../../../../../hooks";

import { Button, Img } from "../../../../../components";

import { FiUpload } from "react-icons/fi";
import { FaMinus } from "react-icons/fa6";
import { File, Payload } from "../../../../../types";

interface Section {
  title: string;
  field: {
    id: number;
    name: string;
    description: string;
    photos: string[];
    photosURLView: string[];
  }[];
}

interface UploadPhotoProps {
  type: "photos" | "videos" | "video360s";
  title: string;
  description: string;
  setFileUrl: React.Dispatch<React.SetStateAction<string[]>>;
}

const UploadPhoto = ({ type, title, description, setFileUrl }: UploadPhotoProps) => {
  const [files, setFiles] = React.useState<string[]>([]);

  const { uploadFile: uploadImages, response: respImage } = useUploads<Payload<File>>();

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    await uploadImages(files!, "villa", type);

    const newMedia = files.map((file) => URL.createObjectURL(file));

    setFiles(newMedia);
    setFileUrl(respImage?.data.successFiles.map((file) => file.url)!);
  };

  const handleRemoveFiles = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <h2 className="text-xl font-bold whitespace-nowrap min-w-60">{title}</h2>
        <div className="flex items-center">
          <p className="whitespace-nowrap min-w-60">{description}</p>
          <div className="relative">
            <input type="file" id={type} onChange={handleFilesChange} hidden accept="video/*,image/*" multiple />
            <label htmlFor={type} className="file-label">
              <FiUpload /> Browse
            </label>
          </div>
          <span className="pl-2 text-sm text-primary whitespace-nowrap">Max. 5mb</span>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {files.map((image, index) => (
          <div key={index} className="relative">
            <button onClick={() => handleRemoveFiles(index)} type="button" className="absolute flex items-center justify-center w-5 h-5 rounded-full -top-2 -right-2 z-1 bg-secondary">
              <FaMinus className="fill-light" />
            </button>
            <Img src={image || "/temp-business.webp"} alt={`Selected image ${index + 1}`} className="w-full h-48 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

const tempSections: Section[] = [
  { title: "Bedrooms", field: [{ id: 1, description: "", name: "", photos: [], photosURLView: [] }] },
  { title: "Outdoor Areas", field: [{ id: 2, description: "", name: "", photos: [], photosURLView: [] }] },
  { title: "Indoor Areas", field: [{ id: 3, description: "", name: "", photos: [], photosURLView: [] }] },
  { title: "More Pictures", field: [{ id: 4, description: "", name: "", photos: [], photosURLView: [] }] },
];

export const Media = () => {
  const [sections, setSections] = React.useState<Section[]>(tempSections);
  const [photos, setPhotos] = React.useState<string[]>([]);
  const [videos, setVideos] = React.useState<string[]>([]);
  const [video360s, setVideo360s] = React.useState<string[]>([]);

  const { uploadFile: uploadImages, response: respImage } = useUploads<Payload<File>>();

  // add field of sections
  const addField = (e: React.MouseEvent, sectionIndex: number) => {
    e.preventDefault();
    setSections((prevSections) =>
      prevSections.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              field: [
                ...section.field,
                {
                  id: section.field.length + 1,
                  name: "",
                  description: "",
                  photos: [],
                  photosURLView: [],
                },
              ],
            }
          : section
      )
    );
  };

  // delete field of sections
  const deleteField = (sectionIndex: number, fieldId: number) => {
    if (sections.filter((section) => section.field.length <= 0)) return;
    setSections((prevSections) =>
      prevSections.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              field: section.field.filter((field) => field.id !== fieldId),
            }
          : section
      )
    );
  };

  // reset field of sections
  const resetField = (e: React.MouseEvent, sectionIndex: number, fieldId: number) => {
    e.preventDefault();
    setSections((prevSections) =>
      prevSections.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              field: section.field.map((field) => (field.id === fieldId ? { ...field, name: "", description: "", photos: [], photosURLView: [] } : field)),
            }
          : section
      )
    );
  };

  // handle input text name or description inside field
  const handleInputChange = (sectionIndex: number, fieldId: number, fieldName: "name" | "description", value: any) => {
    setSections((prevSections) =>
      prevSections.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              field: section.field.map((field) => (field.id === fieldId ? { ...field, [fieldName]: value } : field)),
            }
          : section
      )
    );
  };

  // handle input file change inside field
  const handleFileInputChange = async (sectionIndex: number, fieldId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];

    const viewFiles = files.map((file) => URL.createObjectURL(file));

    await uploadImages(files!, "villa", "photos");

    setSections((prevSections) =>
      prevSections.map((section, sIndex) =>
        sIndex === sectionIndex
          ? {
              ...section,
              field: section.field.map((field) =>
                field.id === fieldId
                  ? {
                      ...field,
                      photos: [...(field.photos || []), ...(respImage?.data.successFiles.map((file) => file.url) || [])],
                      photosURLView: [...(field.photosURLView || []), ...viewFiles],
                    }
                  : field
              ),
            }
          : section
      )
    );
  };

  // remove image inside field
  const removeImage = async (sectionIndex: number, fieldId: number, imgIndex: number) => {
    setSections((prevSections) =>
      prevSections.map((section, sIndex) =>
        sIndex === sectionIndex
          ? {
              ...section,
              field: section.field.map((field) => (field.id === fieldId ? { ...field, photosURLView: field.photosURLView.filter((_, index) => index !== imgIndex) } : field)),
            }
          : section
      )
    );
  };

  const handleSubmitMedia = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedData = {
      additionals: sections.flatMap((section) =>
        section.field
          .filter((field) => field.name !== "" && field.description !== "" && field.photos.length >= 0)
          .map((field) => ({
            name: field.name,
            type: section.title.toLowerCase(),
            description: field.description,
            photos: field.photos,
          }))
      ),
      photos,
      videos,
      video360s,
    };
    console.log("🚀 ~ handleSubmitMedia ~ formattedData:", formattedData);
  };

  return (
    <div className="p-8 border rounded-b bg-light border-dark/20">
      <form className="space-y-8" onSubmit={handleSubmitMedia}>
        {/* Catalog Photo */}
        <UploadPhoto type="photos" title="Photo" description="Catalog Photo *" setFileUrl={setPhotos} />

        {/* Catalog Video */}
        <UploadPhoto type="videos" title="Video" description="Catalog Video *" setFileUrl={setVideos} />

        {/* 360 Tour */}
        <UploadPhoto type="video360s" title="360 Tour" description="360 Tour *" setFileUrl={setVideo360s} />

        {/* Additional Sections */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Additional</h2>
          </div>
          <div className="space-y-8">
            {sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="pt-2 space-y-4">
                <h2 className="text-lg font-semibold">{section.title}</h2>
                {section.field.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <div className="flex items-center">
                      <label className="whitespace-nowrap min-w-60">Name</label>
                      <input type="text" placeholder={section.title} value={field.name} onChange={(e) => handleInputChange(sectionIndex, field.id, "name", e.target.value)} className="input-text" />
                      <label className="px-8 whitespace-nowrap">Description</label>
                      <input
                        type="text"
                        placeholder="King bed, Single bed, Bathroom"
                        value={field.description}
                        onChange={(e) => handleInputChange(sectionIndex, field.id, "description", e.target.value)}
                        className="input-text"
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="whitespace-nowrap min-w-60">Photo</label>
                      <div className="relative">
                        <input type="file" id={field.name} onChange={(e) => handleFileInputChange(sectionIndex, field.id, e)} hidden accept="image/*" multiple />
                        <label htmlFor={field.name} className="file-label">
                          <FiUpload /> Browse
                        </label>
                      </div>
                      <span className="pl-2 text-sm text-primary whitespace-nowrap">Max. 5mb</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {field.photosURLView.map((image, index) => (
                        <div key={index} className="relative">
                          <button
                            onClick={() => removeImage(sectionIndex, field.id, index)}
                            type="button"
                            className="absolute flex items-center justify-center w-5 h-5 rounded-full -top-2 -right-2 z-1 bg-secondary"
                          >
                            <FaMinus className="fill-light" />
                          </button>
                          <Img src={image || "/temp-business.webp"} alt={`Selected image ${index + 1}`} className="w-full h-48 rounded" />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-4">
                      <Button type="button" onClick={(e: React.MouseEvent) => resetField(e, sectionIndex, field.id)} className="w-full btn-outline">
                        Reset
                      </Button>
                      <Button type="button" onClick={() => deleteField(sectionIndex, field.id)} className="w-full btn-red">
                        Delete
                      </Button>
                      <Button type="button" onClick={(e: React.MouseEvent) => addField(e, sectionIndex)} className="w-full btn-primary">
                        + Add More
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button type="button" className="btn-outline">
            Reset
          </Button>
          <Button type="submit" className="btn-primary">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};
