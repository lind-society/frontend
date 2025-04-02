import axios from "axios";

import { ToastMessage } from "../components";

import { baseApiURL } from "../static";

interface UseFileUpload<T> {
  uploadFile: (files: File | File[], folder: string, type: "photos" | "videos" | "video360s") => Promise<{ response: T | null }>;
}

export const useUploads = <T>(): UseFileUpload<T> => {
  const uploadFile = async (files: File | File[], folder: string, type: "photos" | "videos" | "video360s"): Promise<{ response: T | null }> => {
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
        baseURL: baseApiURL,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      ToastMessage({ message: "Success upload file", color: "#0d9488" });

      return { response: resData.data };
    } catch (error: any) {
      ToastMessage({ message: error.response?.data.message || "Upload file error", color: "#b91c1c" });

      return { response: null };
    }
  };

  return { uploadFile };
};
