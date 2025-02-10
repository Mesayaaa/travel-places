export function getImagePath(path: string): string {
  const basePath = process.env.NODE_ENV === 'production' ? '/travel-places' : '';
  return `${basePath}${path}`;
} 