export interface UploadPhotoProps {
  folder: string;
  type: "photos" | "videos" | "video360s";
  title: string;
  description: string;
  fileUrl: string[];
  setFileUrl: (urls: string[]) => void;
}
