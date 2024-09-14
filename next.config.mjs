/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // might be excessive, but let's go with it for now
    },
  },
};

import nextPWA from "next-pwa";

const withPWA = nextPWA({
  dest: "public",
  customWorkerDir: "worker",
});

export default withPWA(nextConfig);
