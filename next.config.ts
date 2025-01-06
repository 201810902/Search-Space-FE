import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ['search.pstatic.net', 'ldb-phinf.pstatic.net'],
  },
  async rewrites() {
    return [
      {
        source: 'api/:path*',
        destination: 'https://searchspaces.store/api/:path*',
      },
    ];
  },
};

export default nextConfig;
