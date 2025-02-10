/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  ...(process.env.NODE_ENV === 'production' ? {
    basePath: '/travel-places',
    assetPrefix: '/travel-places',
  } : {})
};

module.exports = nextConfig; 