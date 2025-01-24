import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects () {
    return [
      {
        source: '/projects/:slug',
        destination: '/not-ready',
        permanent: true
      }
    ]
  }
};

export default nextConfig;
