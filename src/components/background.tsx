import { BackgroundProps } from "../types";

export const Background = ({ src, alt, children, className = "", imgClassName = "", parentClassName = "" }: BackgroundProps) => {
  return (
    <div className={`relative w-full h-screen overflow-hidden ${parentClassName}`}>
      <img src={src} alt={alt} className={`absolute inset-0 w-full h-full object-cover ${imgClassName}`} loading="lazy" />
      <div className={`relative z-5 w-full ${className}`}>{children}</div>
    </div>
  );
};
