import * as React from "react";

import "@photo-sphere-viewer/markers-plugin/index.css";

import { useCreateApi, usePersistentData, useUploads } from "../../../../../hooks";

import { Button, Img, Modal, ToastMessage, UploadPhoto } from "../../../../../components";

import { FaEdit, FaEye, FaPlus, FaUpload } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";

import { capitalize } from "../../../../../utils";

import { FileData, Payload, Villa } from "../../../../../types";

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
  // store data to session storage
  const useStore = usePersistentData<Villa>("get-villa");
  const useEdit = usePersistentData<Villa>("edit-villa");

  const { data: dataBeforeEdit } = useStore();
  const { setData, data: dataAfterEdit } = useEdit();

  const data = dataAfterEdit.photos || dataAfterEdit.video360s || dataAfterEdit.videos || dataAfterEdit.additionals ? dataAfterEdit : dataBeforeEdit;

  const defaultAdditional: Section[] = Object.values(
    data.additionals?.reduce((acc, additional) => {
      const key = additional.type; // Group by type
      if (!acc[key]) acc[key] = { title: capitalize(additional.type), field: [] };
      acc[key].field.push({ id: crypto.randomUUID(), name: additional.name, description: additional.description, photos: additional.photos, photosURLView: [] });
      return acc;
    }, {} as Record<string, Section>) || {}
  );

  const [editMode, setEditMode] = React.useState<boolean>(false);

  const [additional, setAdditional] = React.useState<Section[]>(defaultAdditional.length > 0 ? defaultAdditional : initAdditional);
  const [modalAdditional, setModalAdditional] = React.useState<boolean>(false);

  const [photos, setPhotos] = React.useState<string[]>([]);
  const [videos, setVideos] = React.useState<string[]>([]);
  const [video360s, setVideo360s] = React.useState<string[]>([]);

  const { uploadFile } = useUploads<Payload<FileData>>();
  const { mutate: deleteFile } = useCreateApi({ url: "storages", key: ["photoAdditional"] });

  const otherAdditional = initAdditional.filter((add) => !additional.some((item) => item.title === add.title));

  // add additional from modal
  const addAdditional = (title: string) => {
    setAdditional((prevAdditional) => [{ title, field: [{ id: crypto.randomUUID(), description: "", name: "", photos: [], photosURLView: [] }] }, ...prevAdditional]);
    if (otherAdditional.length <= 1) {
      setModalAdditional(false);
    }
  };

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
    if (!window.confirm("Are you sure want to remove this image?")) return;

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
    // Submit media data here
    const formattedData = {
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
    ToastMessage({ message: "Success saving media", color: "#22c55e" });
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  React.useEffect(() => {
    if (data && data.photos && data.videos && data.video360s) {
      setPhotos(data.photos);
      setVideo360s(data.video360s);
      setVideos(data.videos);
    }
  }, []);

  return (
    <div className="relative p-8 border rounded-b bg-light border-dark/30">
      <Button className="absolute right-8 btn-outline z-3000" onClick={() => setEditMode((prev) => !prev)}>
        {editMode ? (
          <div className="flex items-center gap-2">
            <FaEye size={18} />
            Show Mode
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <FaEdit size={18} />
            Edit Mode
          </div>
        )}
      </Button>
      <form className="relative space-y-8" onSubmit={handleSubmitMedia}>
        <div className={`absolute inset-0 ${editMode ? "-z-1" : "z-2000"}`}></div>

        {/* Catalog Photo */}
        <UploadPhoto folder="villa" type="photos" title="Photo" description="Catalog Photo *" fileUrl={photos} setFileUrl={setPhotos} />

        {/* Catalog Video */}
        <UploadPhoto folder="villa" type="videos" title="Video" description="Catalog Video *" fileUrl={videos} setFileUrl={setVideos} />

        {/* 360 Tour */}
        <UploadPhoto folder="villa" type="video360s" title="360 Tour" description="360 Tour *" fileUrl={video360s} setFileUrl={setVideo360s} />

        {/* Additional Sections */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="heading">Additional</h2>
            {otherAdditional.length > 0 && (
              <Button onClick={() => setModalAdditional(true)} className="flex items-center gap-2 btn-primary" type="button">
                <FaPlus /> Add Additional
              </Button>
            )}
          </div>
          <div className="space-y-12">
            {additional.map((section, additionalIndex) => (
              <div key={additionalIndex} className="space-y-2">
                <h2 className="text-lg font-bold">{section.title}</h2>
                <div className="space-y-6">
                  {section.field.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <div className="flex items-center">
                        <label className="whitespace-nowrap min-w-60">Name</label>
                        <input
                          type="text"
                          placeholder={section.title}
                          value={field.name}
                          onChange={(e) => handleInputChange(additionalIndex, field.id, "name", e.target.value)}
                          className="input-text"
                        />
                        <label className="px-8 whitespace-nowrap">Description</label>
                        <input
                          type="text"
                          placeholder="King bed, Single bed, Bathroom"
                          value={field.description}
                          onChange={(e) => handleInputChange(additionalIndex, field.id, "description", e.target.value)}
                          className="input-text"
                        />
                      </div>
                      <div className="flex items-center pt-1">
                        <label className="whitespace-nowrap min-w-60">Photo</label>
                        <div className="relative">
                          <input type="file" id={field.name} onChange={(e) => handleFileInputChange(additionalIndex, field.id, e)} hidden accept="image/*" multiple />
                          <label htmlFor={field.name} className="file-label">
                            <FaUpload /> Browse
                          </label>
                        </div>
                        <span className="pl-2 text-sm text-primary whitespace-nowrap">Max. 5mb</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2.5 pt-2">
                        {field.photos.map((image, index) => (
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
              </div>
            ))}
          </div>
        </div>
        <div className={`justify-end gap-4 ${editMode ? "flex" : "hidden"}`}>
          <Button className="btn-primary" type="submit">
            Save
          </Button>
        </div>
      </form>
      <Modal isVisible={modalAdditional} onClose={() => setModalAdditional(false)}>
        <h2 className="text-lg font-bold">Add Additional</h2>
        <div className="mt-4 overflow-y-auto border border-dark/30">
          {otherAdditional.map((add, index) => (
            <div key={index} className="flex items-center justify-between p-2 border-b border-dark/30">
              <span>{add.title}</span>
              <Button onClick={() => addAdditional(add.title)} className="btn-outline">
                <FaPlus />
              </Button>
            </div>
          ))}
        </div>
        {/* <div className="flex items-center w-full my-6">
                <div className="flex-grow h-px bg-dark/30"></div>
                <span className="flex-shrink-0 px-3 text-sm text-dark">or</span>
                <div className="flex-grow h-px bg-dark/30"></div>
              </div> */}
        {/* <Button onClick={addFacility} className="flex items-center justify-center w-full gap-2 btn-primary">
                <FaPlus /> Add new key feature
              </Button> */}
      </Modal>
    </div>
  );
};
