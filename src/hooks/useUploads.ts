import axios from "axios";
import { baseApiURL } from "../static";
import toast from "react-hot-toast";

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

      toast("Success upload file", { style: { borderRadius: "5px", background: "#0d9488", color: "#fff" } });

      loading = false;
      return { response: resData.data, loading };
    } catch (error: any) {
      toast(error.response?.data.message || "Upload file error", {
        style: {
          borderRadius: "5px",
          background: "#b91c1c",
          color: "#fff",
        },
      });
      loading = false;
      return { response: null, loading };
    }
  };

  return { uploadFile };
};
