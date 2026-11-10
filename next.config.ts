import type { NextConfig } from "next";

const config: NextConfig = {
  devIndicators: false,
  experimental: { serverActions: { bodySizeLimit: "64mb" } },
  turbopack: { root: process.cwd() },
};

export default config;
