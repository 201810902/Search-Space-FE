import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ['search.pstatic.net', 'ldb-phinf.pstatic.net'],
  },
};

export default nextConfig;
