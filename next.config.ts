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
  
};

export default nextConfig;
