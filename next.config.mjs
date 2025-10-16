/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable serverless functions for Netlify
  experimental: {
    serverComponentsExternalPackages: ['@neondatabase/serverless']
  },
  // Optimize for production
  swcMinify: true,
  // Handle environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  }
};

export default nextConfig;
