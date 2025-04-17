"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useMediaQuery } from "@mui/material";
import { getImagePath } from "../utils/getImagePath";
import { isLowEndDevice } from "../utils/deviceUtils";

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
}

/**
 * ResponsiveImage component loads appropriate image based on screen size
 * For mobile devices, it will use a smaller, optimized image if available
 * For low-end devices, it will reduce quality and apply further optimizations
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
  quality: defaultQuality = 75,
  loading: defaultLoading,
}: ResponsiveImageProps) {
  const isMobile = useMediaQuery("(max-width:768px)");
  const isLowEnd = useRef(false);
  const [imageSrc, setImageSrc] = useState(src);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [quality, setQuality] = useState(defaultQuality);
  const [imgLoading, setImgLoading] = useState(
    defaultLoading || (priority ? "eager" : "lazy")
  );

  // Check if device is low-end on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      isLowEnd.current = isLowEndDevice();

      // Reduksi kualitas gambar untuk perangkat low-end
      if (isLowEnd.current) {
        setQuality(40); // Kualitas lebih rendah untuk perangkat low-end

        // Gunakan teknik lazy load agresif untuk perangkat low-end
        if (!priority) {
          setImgLoading("lazy");
        }
      }
    }
  }, [priority]);

  // Set appropriate image source based on screen size
  useEffect(() => {
    // Untuk perangkat low-end, selalu gunakan versi mobile jika tersedia
    if (isLowEnd.current && mobileSrc) {
      setImageSrc(mobileSrc);
    } else if (isMobile && mobileSrc) {
      setImageSrc(mobileSrc);
    } else {
      setImageSrc(src);
    }
  }, [isMobile, mobileSrc, src]);

  // Handle image load event
  const handleImageLoad = () => {
    setLoading(false);
    setLoaded(true);
    if (onLoad) onLoad();
  };

  // Handle image error (fallback to original src)
  const handleImageError = () => {
    if (mobileSrc && imageSrc !== src) {
      setImageSrc(src);
    }
  };

  // Implementasi lazy loading khusus untuk perangkat low-end
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!isLowEnd.current || priority || loaded) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setLoaded(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "200px", // Muat lebih awal
        threshold: 0.01, // Lebih sensitif
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, loaded]);

  // Gunakan optimasi placeholder blur untuk perangkat low-end
  const blurDataURL = isLowEnd.current
    ? "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" // 1x1 transparent gif
    : undefined;

  return (
    <>
      {loading && !loaded && (
        <div
          className={`bg-gray-200 ${isLowEnd.current ? "" : "animate-pulse"}`}
          style={{
            width: fill ? "100%" : width,
            height: fill ? "100%" : height,
            position: fill ? "absolute" : "relative",
            ...style,
          }}
        />
      )}

      <Image
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        fill={fill}
        priority={priority}
        className={`${className} ${
          loading && !loaded ? "opacity-0" : "opacity-100"
        }`}
        style={{
          transition: isLowEnd.current ? "none" : "opacity 0.3s ease-in-out",
          ...style,
        }}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading={imgLoading}
        sizes={isMobile ? "100vw" : "50vw"}
        quality={quality}
        placeholder={blurDataURL ? "blur" : undefined}
        blurDataURL={blurDataURL}
      />
    </>
  );
}
