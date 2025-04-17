export function getImagePath(path: string): string {
  // Get base path for GitHub Pages
  const basePath = process.env.NODE_ENV === 'production' ? '/travel-places' : '';
  
  // If path already has the basePath, don't add it again
  if (process.env.NODE_ENV === 'production' && path.startsWith('/travel-places')) {
    return path;
  }
  
  return `${basePath}${path}`;
} 