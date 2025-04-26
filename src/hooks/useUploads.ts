import { useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import { API_URL } from "../utils/api";

interface UseFileUpload<T> {
  uploadFile: (files: File | File[], folder: string, type: "photos" | "videos" | "video360s" | "floor-plans") => Promise<{ response: T | null }>;
  isLoading: boolean;
}

export const useUploads = <T>(): UseFileUpload<T> => {
  const [loading, setLoading] = useState<boolean>(false);
  const uploadFile = async (files: File | File[], folder: string, type: "photos" | "videos" | "video360s" | "floor-plans"): Promise<{ response: T | null }> => {
    setLoading(true);
    const formData = new FormData();
    if (Array.isArray(files)) {
      files.forEach((file) => {
        formData.append("files", file);
      });
    } else {
      formData.append("files", files);
    }

    formData.append("key", folder);

    try {
      const resData = await axios.post<T>(`/storages/${type}`, formData, {
        baseURL: API_URL,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Files uploaded successfully !!!");

      setLoading(false);
      return { response: resData.data };
    } catch (error: any) {
      toast.error(error.response?.data.message || "Upload file error");

      setLoading(false);
      return { response: null };
    } finally {
      setLoading(false);
    }
  };

  return { uploadFile, isLoading: loading };
};
