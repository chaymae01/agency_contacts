/** @type {import('next').NextConfig} */
const nextConfig = {
  // Supprimez la section experimental pour Next.js 16
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.clerk.dev',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
    ],
  },
}

module.exports = nextConfig