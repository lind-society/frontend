import { useEffect, useState, useRef, RefObject } from "react";

import { useMediaQuery } from "./useMediaQuery";

export const useToggleState = (initialValue = false): [RefObject<HTMLDivElement>, boolean, () => void] => {
  const [state, setState] = useState(initialValue);
  const isBigScreen = useMediaQuery("(min-width: 1024px)");

  const ref = useRef<HTMLDivElement>(null);

  const toggleState = () => {
    setState((state) => !state);
  };

  const handleHideDropdown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setState(false);
    }
  };

  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setState(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleHideDropdown, true);
    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("keydown", handleHideDropdown, true);
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  useEffect(() => {
    if (isBigScreen) {
      setState(false);
    }
  }, [isBigScreen]);

  return [ref, state, toggleState];
};
