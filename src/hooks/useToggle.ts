import { useState } from "react";

export const useToggle = (defaultValue: boolean): [boolean, (value?: boolean) => void] => {
  const [value, setValue] = useState<boolean>(defaultValue);

  const toggleValue = (value?: boolean): void => {
    setValue((currentValue) => (typeof value === "boolean" ? value : !currentValue));
  };

  return [value, toggleValue];
};
