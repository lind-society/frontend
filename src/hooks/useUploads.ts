import { useState } from "react";

import axios from "axios";

import { baseApiURL } from "../static";

import toast from "react-hot-toast";

interface UseFileUpload<T> {
  uploading: boolean;
  uploadFile: (files: File | File[], folder: string, type: "photos" | "videos" | "video360s") => Promise<void>;
  response: T | null | undefined;
}

export const useUploads = <T>(): UseFileUpload<T> => {
  const [response, setResponse] = useState<T | null>();
  const [uploading, setUploading] = useState<boolean>(false);

  const uploadFile = async (files: File | File[], folder: string, type: "photos" | "videos" | "video360s") => {
    const formData = new FormData();
    if (Array.isArray(files)) {
      files.forEach((file) => {
        formData.append("files", file);
      });
    }

    formData.append("key", folder);

    setUploading(true);

    await axios
      .post(`/storages/${type}`, formData, {
        baseURL: baseApiURL,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        toast.success("Success upload file");
        setResponse(response.data);
      })
      .catch((error) => {
        toast.error(error.response?.data.message || "Upload file error");
      })
      .finally(() => {
        setUploading(false);
      });
  };

  return { response, uploading, uploadFile };
};
