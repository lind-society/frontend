import * as React from "react";
import "@photo-sphere-viewer/markers-plugin/index.css";
import { useCreateApi, usePersistentData, useUploads } from "../../hooks";
import { Button, Img, Modal, ToastMessage, UploadPhoto } from "../../components";
import { FaEdit, FaEye, FaPlus, FaUpload } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { capitalize } from "../../utils";
import { FileData, Payload } from "../../types";

// Define clear interfaces
interface Field {
  id: string;
  name: string;
  description: string;
  photos: string[];
  photosURLView: string[];
}

interface Section {
  title: string;
  field: Field[];
}

interface AdditionalData {
  name: string;
  type: string;
  description: string;
  photos: string[];
}

interface MediaData {
  additionals?: AdditionalData[];
  photos?: string[];
  videos?: string[];
  video360s?: string[];
}

interface MediaProps {
  mode: "add" | "edit";
  entityType: "villa" | "property"; // Entity type for the folder path
  persistKey: string;
  editKey?: string; // Only needed for edit mode
}

// Define the expected return type from usePersistentData hook
interface PersistentDataReturn {
  data: MediaData;
  setData: (data: MediaData) => void;
}

// Define constants outside component to avoid recreating every render
const ADDITIONAL_SECTIONS = ["Bedrooms", "Outdoor Areas", "Indoor Areas", "More Pictures"];
const DEFAULT_ADDITIONAL_SECTIONS = ADDITIONAL_SECTIONS.map((title) => ({
  title,
  field: [createNewField()],
}));

// Helper functions
function createNewField(): Field {
  return {
    id: crypto.randomUUID(),
    description: "",
    name: "",
    photos: [],
    photosURLView: [],
  };
}

function formatAdditionalData(sections: Section[]): AdditionalData[] {
  return sections.flatMap((section) =>
    section.field
      .filter((field) => field.name !== "" && field.description !== "" && field.photos.length > 0)
      .map((field) => ({
        name: field.name,
        type: section.title.toLowerCase(),
        description: field.description,
        photos: field.photos,
      }))
  );
}

export const Media = ({ mode, entityType, persistKey, editKey }: MediaProps) => {
  // ======== STATE MANAGEMENT ========
  // Store data to session storage with proper typing
  const { data: storeData, setData: setStoreData } = usePersistentData<MediaData>(persistKey) as unknown as PersistentDataReturn;

  // Handle edit mode data
  const editStore = mode === "edit" && editKey ? (usePersistentData<MediaData>(editKey) as unknown as PersistentDataReturn) : null;

  const editData = editStore?.data || ({} as MediaData);
  const setEditData = editStore?.setData;

  // For edit mode, choose the right data source
  const data = React.useMemo(() => {
    if (mode === "edit") {
      // Check if edit data has any relevant properties
      if (editData && (editData.photos?.length || editData.video360s?.length || editData.videos?.length || editData.additionals?.length)) {
        return editData;
      }
    }
    return storeData || ({} as MediaData);
  }, [mode, editData, storeData]);

  // Determine which setter function to use
  const setData = mode === "edit" && setEditData ? setEditData : setStoreData;

  // UI State
  const [editMode, setEditMode] = React.useState<boolean>(false);
  const [modalAdditional, setModalAdditional] = React.useState<boolean>(false);

  // Media State
  const [photos, setPhotos] = React.useState<string[]>([]);
  const [videos, setVideos] = React.useState<string[]>([]);
  const [video360s, setVideo360s] = React.useState<string[]>([]);

  // Process additionals data
  const defaultAdditional: Section[] = React.useMemo(() => {
    if (!data.additionals?.length) return DEFAULT_ADDITIONAL_SECTIONS;

    const groupedSections: Record<string, Section> = {};

    data.additionals.forEach((additional) => {
      const key = additional.type;
      if (!groupedSections[key]) {
        groupedSections[key] = {
          title: capitalize(additional.type),
          field: [],
        };
      }

      groupedSections[key].field.push({
        id: crypto.randomUUID(),
        name: additional.name,
        description: additional.description,
        photos: additional.photos,
        photosURLView: [],
      });
    });

    return Object.values(groupedSections);
  }, [data.additionals]);

  const [additional, setAdditional] = React.useState<Section[]>(defaultAdditional);

  // Hook APIs
  const { uploadFile } = useUploads<Payload<FileData>>();
  const { mutate: deleteFile } = useCreateApi({ url: "storages", key: ["photoAdditional"] });

  // ======== COMPUTED VALUES ========
  const otherAdditional = React.useMemo(() => {
    return ADDITIONAL_SECTIONS.filter((title) => !additional.some((item) => item.title === title)).map((title) => ({ title, field: [createNewField()] }));
  }, [additional]);

  // ======== EVENT HANDLERS ========
  // Add additional section from modal
  const addAdditional = (title: string) => {
    setAdditional((prevAdditional) => [{ title, field: [createNewField()] }, ...prevAdditional]);

    if (otherAdditional.length <= 1) {
      setModalAdditional(false);
    }
  };

  // Add field to a section
  const addField = (e: React.MouseEvent, additionalIndex: number) => {
    e.preventDefault();
    setAdditional((prevAdditional) =>
      prevAdditional.map((section, index) =>
        index === additionalIndex
          ? {
              ...section,
              field: [...section.field, createNewField()],
            }
          : section
      )
    );
  };

  // Delete field from a section
  const deleteField = (additionalIndex: number, fieldId: string) => {
    if (additional[additionalIndex]?.field.length <= 1) return;

    if (!window.confirm("Are you sure you want to delete?")) return;

    setAdditional((prevAdditional) => prevAdditional.map((section, index) => (index === additionalIndex ? { ...section, field: section.field.filter((field) => field.id !== fieldId) } : section)));
  };

  // Reset field contents
  const resetField = (e: React.MouseEvent, additionalIndex: number, fieldId: string) => {
    e.preventDefault();
    setAdditional((prevAdditional) =>
      prevAdditional.map((section, index) =>
        index === additionalIndex
          ? {
              ...section,
              field: section.field.map((field) => (field.id === fieldId ? createNewField() : field)),
            }
          : section
      )
    );
  };

  // Handle input text change (name or description)
  const handleInputChange = (additionalIndex: number, fieldId: string, fieldName: "name" | "description", value: string) => {
    setAdditional((prevSections) =>
      prevSections.map((section, index) =>
        index === additionalIndex
          ? {
              ...section,
              field: section.field.map((field) => (field.id === fieldId ? { ...field, [fieldName]: value } : field)),
            }
          : section
      )
    );
  };

  // Handle file upload
  const handleFileInputChange = async (additionalIndex: number, fieldId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (!files.length) return;

    try {
      const { response } = await uploadFile(files, entityType, "photos");
      const viewFiles = files.map((file) => URL.createObjectURL(file));

      if (response?.data?.successFiles?.length) {
        setAdditional((prevSections) =>
          prevSections.map((section, sIndex) =>
            sIndex === additionalIndex
              ? {
                  ...section,
                  field: section.field.map((field) =>
                    field.id === fieldId
                      ? {
                          ...field,
                          photos: [...field.photos, ...response.data.successFiles.map((file) => file.url)],
                          photosURLView: [...field.photosURLView, ...viewFiles],
                        }
                      : field
                  ),
                }
              : section
          )
        );
      }
    } catch (error) {
      ToastMessage({ message: "Error uploading files", color: "#ef4444" });
    }
  };

  // Remove image
  const removeImage = (additionalIndex: number, fieldId: string, imgIndex: number) => {
    if (!window.confirm("Are you sure you want to remove this image?")) return;

    const field = additional[additionalIndex]?.field.find((item) => item.id === fieldId);
    const photoToDelete = field?.photos[imgIndex];

    if (photoToDelete) {
      try {
        deleteFile({ key: photoToDelete });

        setAdditional((prevSections) =>
          prevSections.map((section, sIndex) =>
            sIndex === additionalIndex
              ? {
                  ...section,
                  field: section.field.map((field) =>
                    field.id === fieldId
                      ? {
                          ...field,
                          photos: field.photos.filter((_, index) => index !== imgIndex),
                          photosURLView: field.photosURLView.filter((_, index) => index !== imgIndex),
                        }
                      : field
                  ),
                }
              : section
          )
        );
      } catch (error) {
        ToastMessage({ message: "Error deleting file", color: "#ef4444" });
      }
    }
  };

  // Form submission
  const handleSubmitMedia = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedData: MediaData = {
      additionals: formatAdditionalData(additional),
      photos,
      videos,
      video360s,
    };

    setData(formattedData);
    ToastMessage({ message: "Success saving media", color: "#22c55e" });

    // Consider using navigation instead of page reload
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  // ======== EFFECTS ========
  React.useEffect(() => {
    // Initialize media data from stored data
    if (data) {
      if (data.photos) setPhotos(data.photos);
      if (data.videos) setVideos(data.videos);
      if (data.video360s) setVideo360s(data.video360s);
    }
  }, [data]);

  // ======== RENDER HELPERS ========
  const renderField = (field: Field, additionalIndex: number) => (
    <div key={field.id} className="space-y-2">
      <div className="flex items-center">
        <label className="whitespace-nowrap min-w-60">Name</label>
        <input
          type="text"
          placeholder={additional[additionalIndex]?.title || ""}
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
          <input type="file" id={field.id} onChange={(e) => handleFileInputChange(additionalIndex, field.id, e)} hidden accept="image/*" multiple />
          <label htmlFor={field.id} className="file-label">
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
        <Button type="button" onClick={(e) => resetField(e, additionalIndex, field.id)} className="w-full btn-outline">
          Reset
        </Button>
        <Button type="button" onClick={() => deleteField(additionalIndex, field.id)} className="w-full btn-red">
          Delete
        </Button>
        <Button type="button" onClick={(e) => addField(e, additionalIndex)} className="flex items-center justify-center w-full gap-2 btn-primary">
          <FaPlus /> Add More
        </Button>
      </div>
    </div>
  );

  // ======== RENDER ========
  return (
    <div className="relative p-8 border rounded-b bg-light border-dark/30">
      {mode === "edit" && (
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
      )}

      <form className="relative space-y-8" onSubmit={handleSubmitMedia}>
        {mode === "edit" && <div className={`absolute inset-0 ${editMode ? "-z-1" : "z-2000"}`}></div>}

        {/* Catalog Photo */}
        <UploadPhoto folder={entityType} type="photos" title="Photo" description="Catalog Photo *" fileUrl={photos} setFileUrl={setPhotos} />

        {/* Catalog Video */}
        <UploadPhoto folder={entityType} type="videos" title="Video" description="Catalog Video *" fileUrl={videos} setFileUrl={setVideos} />

        {/* 360 Tour */}
        <UploadPhoto folder={entityType} type="video360s" title="360 Tour" description="360 Tour *" fileUrl={video360s} setFileUrl={setVideo360s} />

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
                <div className="space-y-6">{section.field.map((field) => renderField(field, additionalIndex))}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={`justify-end gap-4 ${mode === "edit" ? (editMode ? "flex" : "hidden") : "flex"}`}>
          <Button className="btn-primary" type="submit">
            Save
          </Button>
        </div>
      </form>

      {/* Add Additional Modal */}
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
      </Modal>
    </div>
  );
};
