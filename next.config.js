/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: 'https://searchspaces.store/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
