import React, { InputHTMLAttributes } from "react";

interface NumberInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const NumberInput = (props: NumberInputProps) => {
  return (
    <input
      {...props}
      type="number"
      onFocus={(e) => {
        e.target.addEventListener(
          "wheel",
          (event) => {
            event.preventDefault();
          },
          { passive: false }
        );
      }}
      onBlur={(e) => {
        e.target.removeEventListener("wheel", (event) => event.preventDefault());
      }}
      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
        if (["e", "E", "+", "-"].includes(e.key)) {
          e.preventDefault();
        }
      }}
    />
  );
};
