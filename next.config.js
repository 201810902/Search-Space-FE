/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://searchspaces.store/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig; 
