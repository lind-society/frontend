export interface UploadPhotoProps {
  type: "photos" | "videos" | "video360s";
  title: string;
  description: string;
  fileUrl: string[];
  setFileUrl: React.Dispatch<React.SetStateAction<string[]>>;
}
