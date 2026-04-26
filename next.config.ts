import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false, // Keeping your UI clean!
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb', // 👈 This fixes the "Failed to fetch" error
    },
  },
};

export default nextConfig;