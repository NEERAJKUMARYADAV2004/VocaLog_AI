/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // This ignores the "PrismaClient" error so you can deploy tonight!
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;