/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.convex.cloud",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "openweathermap.org",
      },
    ],
  },
  transpilePackages: ["@peculiar/utils"],
  webpack: (config) => {
    config.optimization.concatenateModules = false;
    return config;
  },
};

module.exports = nextConfig;
