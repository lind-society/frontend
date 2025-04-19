import * as React from "react";

import { useCreateApi, useUploads } from "../hooks";

import { Img } from "./image";
import { Images360 } from "./images360";

import { FaUpload } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";

import { FileData, Payload, UploadPhotoProps } from "../types";

export const UploadPhoto = ({ folder, type, title, description, fileUrl, setFileUrl }: UploadPhotoProps) => {
  const { uploadFile, isLoading } = useUploads<Payload<FileData>>();
  const { mutate: deleteFile } = useCreateApi({ url: "storages", key: [type] });

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const { response } = await uploadFile(files!, folder, type);

    const uploadedUrls = response?.data.successFiles.map((file) => file.url) || [];

    setFileUrl([...fileUrl, ...uploadedUrls]);
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
            <input type="file" id={type} onChange={handleFilesChange} hidden accept="video/*,image/*" multiple disabled={isLoading} />
            <label htmlFor={type} className="file-label">
              <FaUpload /> {isLoading ? "Waiting..." : "Browse"}
            </label>
          </div>
          <span className="pl-2 text-sm text-primary whitespace-nowrap">{type === "photos" ? "Max. 2mb" : "Max. 20mb"}</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 2xl:grid-cols-4">
        {type === "photos" && (
          <>
            {fileUrl.map((image, index) => (
              <div key={index} className="relative">
                <button onClick={() => handleRemoveFiles(index)} type="button" className="absolute flex items-center justify-center w-5 h-5 rounded-full -top-2 -right-2 z-1 bg-secondary">
                  <IoCloseOutline className="text-light" />
                </button>
                <Img src={image || "/temp-business.webp"} alt={`Selected image ${index + 1}`} className="w-full rounded aspect-square" />
              </div>
            ))}
          </>
        )}
        {type === "videos" && (
          <>
            {fileUrl.map((video, index) => (
              <div key={index} className="relative">
                <button onClick={() => handleRemoveFiles(index)} type="button" className="absolute flex items-center justify-center w-5 h-5 rounded-full -top-2 -right-2 z-1 bg-secondary">
                  <IoCloseOutline className="text-light" />
                </button>
                <video src={video} className="w-full rounded aspect-video" autoPlay muted loop />
              </div>
            ))}
          </>
        )}
        {type === "video360s" && (
          <>
            {fileUrl.map((video, index) => (
              <div key={index} className="relative">
                <button onClick={() => handleRemoveFiles(index)} type="button" className="absolute flex items-center justify-center w-5 h-5 rounded-full z-1000 -top-2 -right-2 bg-secondary">
                  <IoCloseOutline className="text-light" />
                </button>
                <Images360 src={video} />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
