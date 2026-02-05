import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
   turbopack: {
    root: __dirname,
  },
   images:{
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/photos/**", // allows all paths under /photos
      },
    ],
  },
  experimental: {
   serverActions: {
      bodySizeLimit: '5mb', // correct
      // allowedOrigins: ['https://yourdomain.com'] // optional
    },
  },
};

export default nextConfig;
