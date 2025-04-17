"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useMediaQuery } from "@mui/material";

interface ResponsiveImageProps {
  src: string;
  alt: string;
  mobileSrc?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  quality?: number;
  loading?: "eager" | "lazy";
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  objectPosition?: string;
}

/**
 * Simplified ResponsiveImage component for improved mobile compatibility
 */
export default function ResponsiveImage({
  src,
  alt,
  mobileSrc,
  width,
  height,
  fill = false,
  priority = false,
  className = "",
  style,
  onLoad,
  quality = 75,
  loading: defaultLoading,
  objectFit = "cover",
  objectPosition = "center",
}: ResponsiveImageProps) {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgLoading = defaultLoading || (priority ? "eager" : "lazy");

  // Simply set appropriate image source based on screen size
  useEffect(() => {
    if (isMobile && mobileSrc) {
      setImageSrc(mobileSrc);
    } else {
      setImageSrc(src);
    }
  }, [isMobile, mobileSrc, src]);

  // Handle image load event
  const handleImageLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  // Handle image error (fallback to original src)
  const handleImageError = () => {
    if (mobileSrc && imageSrc !== src) {
      setImageSrc(src);
    }
  };

  return (
    <>
      {!isLoaded && (
        <div
          className="bg-gray-200"
          style={{
            width: fill ? "100%" : width,
            height: fill ? "100%" : height,
            position: fill ? "absolute" : "relative",
            ...style,
          }}
        />
      )}

      <Image
        src={imageSrc}
        alt={alt}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        fill={fill}
        priority={priority}
        className={`${className} ${!isLoaded ? "opacity-0" : "opacity-100"}`}
        style={{
          transition: "opacity 0.3s ease-in-out",
          objectFit: objectFit,
          objectPosition: objectPosition,
          ...style,
        }}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading={imgLoading}
        sizes={isMobile ? "100vw" : "100vw"}
        quality={quality}
        unoptimized={false}
      />
    </>
  );
}
