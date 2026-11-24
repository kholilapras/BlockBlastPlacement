/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
allowedDevOrigins: [
    '10.102.31.147',
  ],
}

export default nextConfig
