/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for Vercel
  experimental: {
    serverComponentsExternalPackages: ['@neondatabase/serverless']
  }
};

export default nextConfig;
