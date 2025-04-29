import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  experimental: {
    optimizePackageImports: ['@tanstack/react-query', 'framer-motion'],
    turbo: {},
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mpivilzknwtgopfeqmkb.supabase.co',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'dummyimage.com',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
