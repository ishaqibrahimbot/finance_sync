/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb", // might be excessive, but let's go with it for now
    },
  },
};

import nextPWA from "next-pwa";

const withPWA = nextPWA({
  dest: "public",
});

export default withPWA(nextConfig);
