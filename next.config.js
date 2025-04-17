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
  // Use basePath and assetPrefix for both production and local environments with GitHub repository name
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
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