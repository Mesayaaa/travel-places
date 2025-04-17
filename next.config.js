/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: false,
    deviceSizes: [320, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  ...(process.env.NODE_ENV === 'production' ? {
    basePath: '/travel-places',
    assetPrefix: '/travel-places',
  } : {})
};

module.exports = nextConfig; 