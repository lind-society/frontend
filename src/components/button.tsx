import { ButtonProps } from "../types";

export const Button = ({ children, className, ...props }: ButtonProps) => {
  return (
    <button className={`px-4 text-sm py-2 md:px-6 font-medium duration-300 rounded ${className ?? ""}`} {...props}>
      {children}
    </button>
  );
};
