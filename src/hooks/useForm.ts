import { useState, ChangeEvent } from "react";

export const useForm = <T>(initValues: T): [T, (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void] => {
  const [values, setValues] = useState<T>(initValues);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  return [values, handleChange];
};
