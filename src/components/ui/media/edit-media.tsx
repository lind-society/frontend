import * as React from "react";

import "@photo-sphere-viewer/markers-plugin/index.css";

import { useCreateApi, usePersistentData, useUploads } from "../../../hooks";

import { Button, Modal, ToastMessage, UploadPhoto } from "../..";

import { AdditionalSection } from "./additional-section";

import { FaEdit, FaEye, FaPlus } from "react-icons/fa";

import { capitalize } from "../../../utils";

import { additionalEqual, arraysEqual, createEmptyField, createInitialSections, DEFAULT_SECTION_TITLES } from "./helpers";

import { AdditionalItem, FileData, Payload } from "../../../types";
import { FormStateType, MediaPersistedType, Section } from "./types";

interface MediaProps {
  type: string;
  persistedDataKey: string;
  editDataKey: string;
  onChange?: (hasChanges: boolean) => void;
}

export const EditMedia: React.FC<MediaProps> = ({ persistedDataKey, editDataKey, onChange, type }) => {
  // store data to session storage
  const useStore = usePersistentData<MediaPersistedType>(persistedDataKey);
  const useEdit = usePersistentData<MediaPersistedType>(editDataKey);
  const { data: dataBeforeEdit } = useStore();
  const { setData, data: dataAfterEdit } = useEdit();

  const { uploadFile, isLoading } = useUploads<Payload<FileData>>();
  const { mutate: deleteFile } = useCreateApi({ url: "storages", key: [type] });

  const data = React.useMemo(() => {
    return dataAfterEdit.photos || dataAfterEdit.video360s || dataAfterEdit.videos || dataAfterEdit.additionals ? dataAfterEdit : dataBeforeEdit;
  }, [dataAfterEdit, dataBeforeEdit]);

  const defaultAdditional = React.useMemo(() => {
    if (!data.additionals) return [];

    const groupedAdditionals = data.additionals.reduce((acc, additional) => {
      const key = additional.type;
      if (!acc[key]) acc[key] = { title: capitalize(additional.type), field: [] };
      acc[key].field.push({
        id: crypto.randomUUID(),
        name: additional.name,
        description: additional.description,
        photos: additional.photos,
        photosURLView: [],
      });
      return acc;
    }, {} as Record<string, Section>);

    return Object.values(groupedAdditionals);
  }, [data.additionals]);

  const [editMode, setEditMode] = React.useState<boolean>(false);
  const [modalAdditional, setModalAdditional] = React.useState<boolean>(false);

  const [formState, setFormState] = React.useState<FormStateType>({
    additional: defaultAdditional.length > 0 ? defaultAdditional : createInitialSections(DEFAULT_SECTION_TITLES),
    photos: data.photos || [],
    videos: data.videos || [],
    video360s: data.video360s || [],
  });

  const availableAdditionalTypes = React.useMemo(() => {
    return DEFAULT_SECTION_TITLES.filter((title) => !formState.additional.some((section) => section.title === title));
  }, [formState.additional]);

  const updateFormState = (updates: Partial<FormStateType>) => {
    setFormState((prev) => ({ ...prev, ...updates }));
  };

  const updateAdditionalState = (updatedAdditional: Section[]) => {
    updateFormState({ additional: updatedAdditional });
  };

  const addAdditional = (title: string) => {
    updateAdditionalState([{ title, field: [createEmptyField()] }, ...formState.additional]);

    if (availableAdditionalTypes.length <= 1) {
      setModalAdditional(false);
    }
  };

  const addField = (e: React.MouseEvent, additionalIndex: number) => {
    e.preventDefault();

    updateAdditionalState(formState.additional.map((section, index) => (index === additionalIndex ? { ...section, field: [...section.field, createEmptyField()] } : section)));
  };

  const deleteField = (e: React.MouseEvent, additionalIndex: number, fieldId: string) => {
    e.preventDefault();
    const section = formState.additional[additionalIndex];
    if (section.field.length <= 1) return;

    if (!window.confirm("Are you sure you want to delete this field?")) return;

    updateAdditionalState(formState.additional.map((section, index) => (index === additionalIndex ? { ...section, field: section.field.filter((field) => field.id !== fieldId) } : section)));
  };

  const resetField = (e: React.MouseEvent, additionalIndex: number, fieldId: string) => {
    e.preventDefault();

    updateAdditionalState(
      formState.additional.map((section, index) =>
        index === additionalIndex
          ? {
              ...section,
              field: section.field.map((field) => (field.id === fieldId ? { ...field, name: "", description: "", photos: [], photosURLView: [] } : field)),
            }
          : section
      )
    );
  };

  const handleInputChange = (additionalIndex: number, fieldId: string, fieldName: "name" | "description", value: string) => {
    updateAdditionalState(
      formState.additional.map((section, index) =>
        index === additionalIndex
          ? {
              ...section,
              field: section.field.map((field) => (field.id === fieldId ? { ...field, [fieldName]: value } : field)),
            }
          : section
      )
    );
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>, additionalIndex: number, fieldId: string) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    const { response } = await uploadFile(files, type, "photos");

    const viewFiles = files.map((file) => URL.createObjectURL(file));

    if (response) {
      updateAdditionalState(
        formState.additional.map((section, sIndex) =>
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
  };

  const removeImage = async (additionalIndex: number, fieldId: string, imgIndex: number) => {
    if (!window.confirm("Are you sure want to remove this image?")) return;

    const targetField = formState.additional[additionalIndex].field.find((item) => item.id === fieldId);

    if (targetField) deleteFile({ key: targetField.photos[imgIndex] });

    updateAdditionalState(
      formState.additional.map((section, sIndex) =>
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
  };

  const handleSubmitMedia = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedData = {
      additionals: formState.additional.flatMap((section) =>
        section.field
          .filter((field) => field.name !== "" && field.description !== "" && field.photos.length > 0)
          .map((field) => ({ name: field.name, type: section.title.toLowerCase(), description: field.description, photos: field.photos }))
      ) as AdditionalItem[],
      photos: formState.photos,
      videos: formState.videos,
      video360s: formState.video360s,
    };

    setData(formattedData);

    ToastMessage({ message: "Success saving edit media...", color: "#22c55e" });

    setTimeout(() => {
      window.location.reload();
    }, 200);
  };

  React.useEffect(() => {
    if (!onChange) return;

    const currentAdditionals = formState.additional.flatMap((section) =>
      section.field
        .filter((field) => field.name !== "" && field.description !== "" && field.photos.length > 0)
        .map((field) => ({
          name: field.name,
          type: section.title.toLowerCase(),
          description: field.description,
          photos: field.photos,
        }))
    ) as AdditionalItem[];

    const hasChanges =
      !arraysEqual(formState.photos, data.photos!) ||
      !arraysEqual(formState.videos, data.videos!) ||
      !arraysEqual(formState.video360s, data.video360s!) ||
      !additionalEqual(currentAdditionals, data.additionals);

    onChange(hasChanges);
  }, [formState]);

  return (
    <>
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

        <UploadPhoto folder={type} type="photos" title="Photo" description="Catalog Photo *" fileUrl={formState.photos} setFileUrl={(photos) => updateFormState({ photos })} />

        <UploadPhoto folder={type} type="videos" title="Video" description="Catalog Video *" fileUrl={formState.videos} setFileUrl={(videos) => updateFormState({ videos })} />

        <UploadPhoto folder={type} type="video360s" title="360 Tour" description="360 Tour *" fileUrl={formState.video360s} setFileUrl={(video360s) => updateFormState({ video360s })} />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="heading">Additional</h2>
            {availableAdditionalTypes.length > 0 && (
              <Button onClick={() => setModalAdditional(true)} className="flex items-center gap-2 btn-primary" type="button">
                <FaPlus /> Add Additional
              </Button>
            )}
          </div>
          <div className="space-y-12">
            {formState.additional.map((section, additionalIndex) => (
              <AdditionalSection
                key={section.title}
                section={section}
                onFieldAdd={(e) => addField(e, additionalIndex)}
                onFieldUpdate={(fieldId, fieldName, value) => handleInputChange(additionalIndex, fieldId, fieldName, value)}
                onFieldDelete={(e, fieldId) => deleteField(e, additionalIndex, fieldId)}
                onFieldReset={(e, fieldId) => resetField(e, additionalIndex, fieldId)}
                onRemoveImage={(fieldId, imgIndex) => removeImage(additionalIndex, fieldId, imgIndex)}
                onUpdateImage={(e, fieldId) => handleFileInputChange(e, additionalIndex, fieldId)}
                isLoading={isLoading}
              />
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
          {availableAdditionalTypes.map((title, index) => (
            <div key={index} className="flex items-center justify-between p-2 border-b border-dark/30">
              <span>{title}</span>
              <Button onClick={() => addAdditional(title)} className="btn-outline">
                <FaPlus />
              </Button>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};
