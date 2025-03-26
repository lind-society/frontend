import axios from "axios";
import { baseApiURL } from "../static";

import { ToastMessage } from "../components";

interface UseFileUpload<T> {
  uploadFile: (files: File | File[], folder: string, type: "photos" | "videos" | "video360s") => Promise<{ response: T | null; loading: boolean }>;
}

export const useUploads = <T>(): UseFileUpload<T> => {
  const uploadFile = async (files: File | File[], folder: string, type: "photos" | "videos" | "video360s"): Promise<{ response: T | null; loading: boolean }> => {
    const formData = new FormData();
    if (Array.isArray(files)) {
      files.forEach((file) => {
        formData.append("files", file);
      });
    } else {
      formData.append("files", files);
    }

    formData.append("key", folder);

    let loading = true;
    try {
      const resData = await axios.post<T>(`/storages/${type}`, formData, {
        baseURL: baseApiURL,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      ToastMessage({ message: "Success upload file", color: "#0d9488" });

      loading = false;
      return { response: resData.data, loading };
    } catch (error: any) {
      ToastMessage({ message: error.response?.data.message || "Upload file error", color: "#b91c1c" });

      loading = false;
      return { response: null, loading };
    }
  };

  return { uploadFile };
};
