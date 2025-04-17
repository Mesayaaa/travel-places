import { getImagePath } from './getImagePath';

/**
 * Generate mobile-optimized image path from original image path
 * If the image path includes 'images/', it will look for a mobile version in 'images/mobile/'
 * 
 * @param originalSrc Original image path
 * @returns Optimized mobile image path
 */
export function getMobileImagePath(originalSrc: string): string {
  // If the path already contains 'mobile/', return as is
  if (originalSrc.includes('/mobile/')) {
    return originalSrc;
  }
  
  // For images in the images folder
  if (originalSrc.includes('/images/')) {
    const fileName = originalSrc.split('/').pop() || '';
    const baseName = fileName.split('.')[0];
    const extension = fileName.split('.').pop() || 'jpg';
    
    // Create mobile version path: /images/mobile/filename-mobile.extension
    return originalSrc.replace(
      `/images/${fileName}`, 
      `/images/mobile/${baseName}-mobile.${extension}`
    );
  }
  
  // For other paths, add -mobile suffix before extension
  const parts = originalSrc.split('.');
  const extension = parts.pop() || 'jpg';
  return `${parts.join('.')}-mobile.${extension}`;
}

/**
 * Get responsive image configuration with both original and mobile sources
 * 
 * @param src Original image path (can be relative to public folder)
 * @returns Object with src and mobileSrc properties
 */
export function getResponsiveImageSrc(src: string): { src: string, mobileSrc: string } {
  const originalSrc = src.startsWith('/') ? src : `/${src}`;
  const mobileSrc = getMobileImagePath(originalSrc);
  
  return {
    src: getImagePath(originalSrc),
    mobileSrc: getImagePath(mobileSrc)
  };
}

/**
 * Generate srcSet string for responsive images
 * 
 * @param basePath Base path of the image without extension
 * @param extension Image extension (default: 'jpg')
 * @param widths Array of widths to include in srcSet
 * @returns srcSet string for use in img tag
 */
export function generateSrcSet(
  basePath: string, 
  extension: string = 'jpg', 
  widths: number[] = [320, 640, 960, 1280, 1920]
): string {
  return widths
    .map(width => `${basePath}-${width}.${extension} ${width}w`)
    .join(', ');
}

/**
 * Get image dimensions (simulation - in a real app, this would get actual dimensions)
 * 
 * @param src Image source
 * @returns Object with width and height properties
 */
export function getImageDimensions(src: string): { width: number, height: number } {
  // These would normally be calculated or retrieved from a database
  // For now, we'll return arbitrary dimensions based on the image type
  if (src.includes('borobudur')) {
    return { width: 1920, height: 1080 };
  } else if (src.includes('breeze')) {
    return { width: 800, height: 600 };
  } else if (src.includes('karaoke')) {
    return { width: 800, height: 600 };
  } else if (src.includes('nako')) {
    return { width: 800, height: 600 };
  } else if (src.includes('makan')) {
    return { width: 800, height: 600 };
  }
  
  // Default dimensions
  return { width: 800, height: 600 };
} 