import { useState } from "react";

import { useInView } from "react-intersection-observer";

import { ImageProps } from "../types";

export const Img = ({ src, alt, className = "", loading = "eager", sizes, srcSet }: ImageProps) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {inView && (
        <>
          <img
            src={src}
            alt={alt}
            loading={loading}
            sizes={sizes}
            srcSet={srcSet}
            onLoad={() => setIsLoaded(true)}
            className={`transition-opacity duration-300 w-full h-full object-cover ${isLoaded ? "opacity-100" : "opacity-0"}`}
          />
          {!isLoaded && (
            <div
              className="absolute inset-0 bg-gray-200 shimmer"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

{
  /* <Img
  src="https://via.placeholder.com/800x600"
  alt="Example image with shimmer"
  className="rounded-lg"
  width={800}
  height={600}
  loading="lazy"
  sizes="(max-width: 768px) 100vw, 50vw"
  srcSet="
          https://via.placeholder.com/400x300 400w,
          https://via.placeholder.com/800x600 800w,
          https://via.placeholder.com/1200x900 1200w
        "
/>; */
}
