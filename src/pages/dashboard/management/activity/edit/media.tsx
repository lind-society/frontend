import * as React from "react";

import { usePersistentData } from "../../../../../hooks";

import { Button, ToastMessage } from "../../../../../components";

import { UploadPhoto } from "../../../../../components/ui/media/upload-photo";

import { Activity } from "../../../../../types";
import { FaEdit, FaEye } from "react-icons/fa";

interface FormStateType {
  photos: string[];
  videos: string[];
}

const arraysEqual = (a: string[], b: string[]) => {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

export const EditMediaTab: React.FC<{ onChange?: (hasChanges: boolean) => void }> = ({ onChange }) => {
  // store data to session storage
  const useStore = usePersistentData<Partial<Activity>>("get-activity");
  const useEdit = usePersistentData<Partial<Activity>>("edit-activity");
  const { data: dataBeforeEdit } = useStore();
  const { setData, data: dataAfterEdit } = useEdit();

  const data = React.useMemo(() => {
    return dataAfterEdit.photos || dataAfterEdit.videos ? dataAfterEdit : dataBeforeEdit;
  }, [dataAfterEdit, dataBeforeEdit]);

  const [editMode, setEditMode] = React.useState<boolean>(false);

  const [formState, setFormState] = React.useState<FormStateType>({
    photos: data.photos || [],
    videos: data.videos || [],
  });

  const updateFormState = (updates: Partial<FormStateType>) => {
    setFormState((prev) => {
      const newState = { ...prev, ...updates };
      return newState;
    });
  };

  const handleSubmitMedia = (e: React.FormEvent) => {
    e.preventDefault();

    const isComplete = formState.photos.length > 0;

    if (!isComplete) return;

    const dataToDelete = {
      photos: formState.photos,
      videos: formState.videos,
    };

    setData(dataToDelete);
    ToastMessage({ message: "Success saving edit media...", color: "#22c55e" });
    setTimeout(() => {
      window.location.reload();
    }, 200);
  };

  React.useEffect(() => {
    if (!onChange) return;

    const hasChanges = !arraysEqual(formState.photos, data.photos!) || !arraysEqual(formState.videos, data.videos!);

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
      <form className="relative" onSubmit={handleSubmitMedia}>
        <div className={`absolute inset-0 ${editMode ? "-z-1" : "z-2000"}`}></div>
        <UploadPhoto folder="activity" type="photos" title="Photo" description="Catalog Photo *" fileUrl={formState.photos} setFileUrl={(photos) => updateFormState({ photos })} />

        <UploadPhoto folder="activity" type="videos" title="Video" description="Catalog Video" fileUrl={formState.videos} setFileUrl={(videos) => updateFormState({ videos })} />
        <div className={`justify-end gap-4 ${editMode ? "flex" : "hidden"}`}>
          <Button className="btn-primary" type="submit">
            Save
          </Button>
        </div>
      </form>
    </>
  );
};
