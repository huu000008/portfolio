import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  experimental: {
    typedRoutes: true,
    turbo: {
      // Turbopack 관련 옵션은 객체로 작성해야 lint 에러가 발생하지 않습니다.
      // 필요하다면 resolveAlias, resolveExtensions 등 추가 가능
    },
    optimizePackageImports: [
      // 빌드 시 패키지별 tree-shaking 최적화
      "@tanstack/react-query",
      "framer-motion",
    ],
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
