/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    deviceSizes: [320, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  // Set basePath and assetPrefix for GitHub Pages
  basePath: process.env.NODE_ENV === 'production' ? '/travel-places' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/travel-places' : '',
  experimental: {
    optimizeCss: false,
    optimizePackageImports: [
      '@mui/material',
      '@mui/icons-material',
      'framer-motion'
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (config, { dev, isServer }) => {
    // Optimize images
    config.module.rules.push({
      test: /\.(jpe?g|png|webp|avif)$/i,
      type: 'asset',
      parser: {
        dataUrlCondition: {
          maxSize: 10 * 1024, // 10kb
        },
      },
    });

    // Return the modified config
    return config;
  },
};

module.exports = nextConfig; 