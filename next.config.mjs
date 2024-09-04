/** @type {import('next').NextConfig} */
const nextConfig = {};

import nextPWA from "next-pwa";

const withPWA = nextPWA({
  dest: "public",
});

export default withPWA(nextConfig);
