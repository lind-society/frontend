import * as React from "react";

import "@photo-sphere-viewer/markers-plugin/index.css";

import { useCreateApi, usePersistentData, useUploads } from "../../../hooks";

import { UploadPhoto } from "./upload-photo";
import { Button, Modal } from "../../../components";

import { AdditionalSection } from "./additional-section";

import { FaPlus } from "react-icons/fa";

import { capitalize } from "../../../utils";

import { createEmptyField, createInitialSections, DEFAULT_SECTION_TITLES } from "./helpers";

import { AdditionalItem, FileData, Payload } from "../../../types";
import { FormStateType, MediaPersistedType, Section } from "./types";

interface MediaProps {
  type: string;
  persistedDataKey: string;
  onChange?: (hasChanges: boolean) => void;
}

export const AddMedia: React.FC<MediaProps> = ({ persistedDataKey, type, onChange }) => {
  // store data to session storage
  const useStore = usePersistentData<MediaPersistedType>(persistedDataKey);
  const { setData, data } = useStore();

  const { uploadFile, isLoading } = useUploads<Payload<FileData>>();
  const { mutate: deleteFile } = useCreateApi({ url: "storages", key: ["photoAdditional"] });

  const defaultAdditional: Section[] = React.useMemo(() => {
    if (!data.additionals?.length) return [];

    return Object.values(
      data.additionals.reduce((acc, additional) => {
        const key = additional.type;
        if (!acc[key]) acc[key] = { title: capitalize(additional.type), field: [] };
        acc[key].field.push({ id: crypto.randomUUID(), name: additional.name, description: additional.description, photos: additional.photos });
        return acc;
      }, {} as Record<string, Section>)
    );
  }, [data.additionals]);

  const initialFormState: FormStateType = {
    additional: defaultAdditional.length > 0 ? defaultAdditional : createInitialSections(DEFAULT_SECTION_TITLES),
    photos: data.photos?.length ? data.photos : [],
    videos: data.videos?.length ? data.videos : [],
    video360s: data.video360s?.length ? data.video360s : [],
    floorPlans: data.floorPlans?.length ? data.floorPlans : [],
  };

  const [formState, setFormState] = React.useState<FormStateType>(initialFormState);

  const [modalAdditional, setModalAdditional] = React.useState<boolean>(false);

  const availableAdditionalTypes = React.useMemo(() => {
    return DEFAULT_SECTION_TITLES.filter((title) => !formState.additional.some((section) => section.title === title));
  }, [formState.additional]);

  React.useEffect(() => {
    if (!onChange) return;

    const hasAnyAdditional = formState.additional.some((a) => a.field.some((b) => b.name !== "" && b.description !== "" && b.photos.length > 0));

    const isComplete = hasAnyAdditional && formState.photos.length > 0 && formState.videos.length > 0;

    if (isComplete) {
      const dataToSave = {
        additionals: formState.additional.flatMap((section) =>
          section.field
            .filter((field) => field.name !== "" && field.description !== "" && field.photos.length > 0)
            .map((field) => ({ name: field.name, type: section.title.toLowerCase(), description: field.description, photos: field.photos }))
        ) as AdditionalItem[],
        photos: formState.photos.filter((photo) => photo !== ""),
        videos: formState.videos.filter((video) => video !== ""),
        video360s: formState.video360s.filter((video360) => video360 !== ""),
        floorPlans: formState.floorPlans.filter((floorPlan) => floorPlan !== ""),
      };

      setData(dataToSave);
      onChange(false);
    } else {
      onChange(true);
    }
  }, [formState]);

  const updateFormState = (updates: Partial<FormStateType>) => {
    setFormState((prev) => {
      const newState = { ...prev, ...updates };
      return newState;
    });
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

    if (!window.confirm("Are you sure you want to delete?")) return;

    updateAdditionalState(formState.additional.map((section, index) => (index === additionalIndex ? { ...section, field: section.field.filter((field) => field.id !== fieldId) } : section)));
  };

  const resetField = (e: React.MouseEvent, additionalIndex: number, fieldId: string) => {
    e.preventDefault();

    updateAdditionalState(
      formState.additional.map((section, index) =>
        index === additionalIndex
          ? {
              ...section,
              field: section.field.map((field) => (field.id === fieldId ? { ...field, name: "", description: "", photos: [] } : field)),
            }
          : section
      )
    );
  };

  const updateField = (additionalIndex: number, fieldId: string, fieldName: "name" | "description", value: string) => {
    updateAdditionalState(
      formState.additional.map((section, index) =>
        index === additionalIndex ? { ...section, field: section.field.map((field) => (field.id === fieldId ? { ...field, [fieldName]: value } : field)) } : section
      )
    );
  };

  const updateImage = async (e: React.ChangeEvent<HTMLInputElement>, additionalIndex: number, fieldId: string) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    const { response } = await uploadFile(files, type, "photos");

    if (response) {
      updateAdditionalState(
        formState.additional.map((section, sIndex) =>
          sIndex === additionalIndex
            ? {
                ...section,
                field: section.field.map((field) => (field.id === fieldId ? { ...field, photos: [...field.photos, ...response.data.successFiles.map((file) => file.url)] } : field)),
              }
            : section
        )
      );
    }
  };

  const removeImage = async (additionalIndex: number, fieldId: string, imgIndex: number) => {
    if (!window.confirm("Are you sure want to remove this image?")) return;

    const targetField = formState.additional[additionalIndex].field.find((item) => item.id === fieldId);
    if (targetField) {
      deleteFile({ key: targetField.photos[imgIndex] });
    }

    updateAdditionalState(
      formState.additional.map((section, sIndex) =>
        sIndex === additionalIndex
          ? {
              ...section,
              field: section.field.map((field) => (field.id === fieldId ? { ...field, photos: field.photos.filter((_, index) => index !== imgIndex) } : field)),
            }
          : section
      )
    );
  };

  return (
    <>
      <div className="space-y-8">
        <UploadPhoto folder={type} type="photos" title="Photo" description="Catalog Photo *" fileUrl={formState.photos} setFileUrl={(photos) => updateFormState({ photos })} />

        <UploadPhoto folder={type} type="videos" title="Video" description="Catalog Video *" fileUrl={formState.videos} setFileUrl={(videos) => updateFormState({ videos })} />

        <UploadPhoto folder={type} type="video360s" title="360 Tour" description="360 Tour" fileUrl={formState.video360s} setFileUrl={(video360s) => updateFormState({ video360s })} />

        <UploadPhoto folder={type} type="floor-plans" title="Floor Plan" description="Floor Plan" fileUrl={formState.floorPlans} setFileUrl={(floorPlans) => updateFormState({ floorPlans })} />

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
                onFieldUpdate={(fieldId, fieldName, value) => updateField(additionalIndex, fieldId, fieldName, value)}
                onFieldDelete={(e, fieldId) => deleteField(e, additionalIndex, fieldId)}
                onFieldReset={(e, fieldId) => resetField(e, additionalIndex, fieldId)}
                onRemoveImage={(fieldId, imgIndex) => removeImage(additionalIndex, fieldId, imgIndex)}
                onUpdateImage={(e, fieldId) => updateImage(e, additionalIndex, fieldId)}
                isLoading={isLoading}
              />
            ))}
          </div>
        </div>
      </div>

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
