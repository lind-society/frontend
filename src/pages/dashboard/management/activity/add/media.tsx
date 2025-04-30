import * as React from "react";

import { usePersistentData } from "../../../../../hooks";

import { UploadPhoto } from "../../../../../components/ui/media/upload-photo";

import { Activity } from "../../../../../types";

interface FormStateType {
  photos: string[];
  videos: string[];
}

export const AddMediaTab: React.FC<{ onChange?: (hasChanges: boolean) => void }> = ({ onChange }) => {
  // store data to session storage
  const useStore = usePersistentData<Partial<Activity>>("add-activity");
  const { setData, data } = useStore();

  const initialFormState: FormStateType = {
    photos: data.photos?.length ? data.photos : [],
    videos: data.videos?.length ? data.videos : [],
  };

  const [formState, setFormState] = React.useState<FormStateType>(initialFormState);

  React.useEffect(() => {
    if (!onChange) return;

    const isComplete = formState.photos.length > 0;

    if (isComplete) {
      const dataToSave = {
        photos: formState.photos.filter((photo) => photo !== ""),
        videos: formState.videos.filter((video) => video !== ""),
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

  return (
    <>
      <UploadPhoto folder="activity" type="photos" title="Photo" description="Catalog Photo *" fileUrl={formState.photos} setFileUrl={(photos) => updateFormState({ photos })} />

      <UploadPhoto folder="activity" type="videos" title="Video" description="Catalog Video" fileUrl={formState.videos} setFileUrl={(videos) => updateFormState({ videos })} />
    </>
  );
};
