import { toast } from "react-hot-toast";
import { ToastMessageProps } from "../types";

export const ToastMessage = ({ message, color }: ToastMessageProps) => {
  toast(message, {
    style: {
      borderRadius: "5px",
      background: color,
      color: "#fff",
    },
  });
};
