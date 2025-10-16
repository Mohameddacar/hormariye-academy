/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable serverless functions for Netlify
  serverExternalPackages: ['@neondatabase/serverless'],
  // Handle environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  }
};

export default nextConfig;
