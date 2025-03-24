import * as React from "react";

import { motion } from "framer-motion";

import { ModalProps } from "../types";
import { GrClose } from "react-icons/gr";

export const Modal = ({ isVisible, onClose, children }: ModalProps) => {
  React.useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center w-full h-full min-h-screen p-4 bg-opacity-50 bg-dark z-100000">
      <motion.div
        className="relative w-full max-w-screen-md px-4 pt-10 pb-4 mx-auto my-4 overflow-y-auto rounded-lg shadow-lg max-h-custom-height scrollbar bg-light"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <button className="btn-cross-border group" onClick={onClose}>
          <GrClose className="text-primary group-hover:text-light" />
        </button>
        {children}
      </motion.div>
    </div>
  );
};
