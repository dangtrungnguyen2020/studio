/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')();
 
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};
 
module.exports = withNextIntl(nextConfig);
