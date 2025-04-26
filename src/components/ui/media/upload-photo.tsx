import * as React from "react";

import { useCreateApi, useUploads } from "../../../hooks";

import { Img } from "../../image";
import { Images360 } from "../../images360";

import { FaUpload } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";

import { FileData, Payload } from "../../../types";

interface UploadPhotoProps {
  folder: string;
  type: "photos" | "videos" | "video360s" | "floor-plans";
  title: string;
  description: string;
  fileUrl: string[];
  setFileUrl: (urls: string[]) => void;
}

const ViewFiles = ({ children, index, handleRemoveFiles }: { children: React.ReactNode; handleRemoveFiles: (index: number) => void; index: number }) => {
  return (
    <div className="relative">
      <button onClick={() => handleRemoveFiles(index)} type="button" className="absolute flex items-center justify-center rounded-full size-6 -top-2 -right-2 z-1 bg-secondary hover:bg-secondary/80">
        <IoCloseOutline className="text-light" />
      </button>
      {children}
    </div>
  );
};

export const UploadPhoto = ({ folder, type, title, description, fileUrl, setFileUrl }: UploadPhotoProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { uploadFile, isLoading } = useUploads<Payload<FileData>>();
  const { mutate: deleteFile } = useCreateApi({ key: [type], url: "storages" });

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;
    const { response } = await uploadFile(files!, folder, type);
    const uploadedUrls = response?.data.successFiles.map((file) => file.url) || [];
    setFileUrl([...fileUrl, ...uploadedUrls]);

    // Clear the input value so same file can be selected again later
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFiles = (index: number) => {
    if (!window.confirm("Are you sure want to remove this image?")) return;
    deleteFile({ key: fileUrl[index] });
    setFileUrl(fileUrl.filter((_, i) => i !== index));
  };

  return (
    <div className={`space-y-4 ${type === "photos" && "!mt-2"}`}>
      <div className="space-y-4">
        <h2 className="heading">{title}</h2>
        <div className="flex items-center">
          <p className="whitespace-nowrap min-w-60">{description}</p>
          <div className="relative">
            <input type="file" ref={fileInputRef} id={type} onChange={handleFilesChange} hidden accept={type === "videos" ? "video/*" : "image/*"} multiple disabled={isLoading} />
            <label htmlFor={type} className="file-label">
              <FaUpload /> {isLoading ? "Waiting..." : "Browse"}
            </label>
          </div>
          <span className="pl-2 text-sm text-primary whitespace-nowrap">{type === "photos" ? "Max. 5mb" : type === "floor-plans" ? "Max. 5mb" : type === "video360s" ? "Max. 15mb" : "Max. 50mb"}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4">
        {type === "photos" && (
          <>
            {fileUrl.map((image, index) => (
              <ViewFiles key={index} handleRemoveFiles={handleRemoveFiles} index={index}>
                <Img src={image || "/images/modern-villa-background.webp"} alt={`Selected image ${index + 1}`} className="w-full rounded aspect-square" />
              </ViewFiles>
            ))}
          </>
        )}
        {type === "videos" && (
          <>
            {fileUrl.map((video, index) => (
              <ViewFiles key={index} handleRemoveFiles={handleRemoveFiles} index={index}>
                <video src={video} className="w-full rounded aspect-video" autoPlay muted loop />
              </ViewFiles>
            ))}
          </>
        )}
        {type === "video360s" && (
          <>
            {fileUrl.map((image, index) => (
              <ViewFiles key={index} handleRemoveFiles={handleRemoveFiles} index={index}>
                <Images360 src={image} />
              </ViewFiles>
            ))}
          </>
        )}
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 2xl:grid-cols-3">
        {type === "floor-plans" && (
          <>
            {fileUrl.map((image, index) => (
              <ViewFiles key={index} handleRemoveFiles={handleRemoveFiles} index={index}>
                <Img src={image || "/images/modern-villa-background.webp"} alt={`Selected image ${index + 1}`} className="w-full rounded aspect-square" />
              </ViewFiles>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
