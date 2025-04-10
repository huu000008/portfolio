import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
