/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/travel-places',
  assetPrefix: '/travel-places',
};

module.exports = nextConfig; 