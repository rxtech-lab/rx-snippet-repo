import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // includes files from the monorepo base two directories up
  outputFileTracingRoot: path.join(__dirname, "../.."),
};

export default nextConfig;
