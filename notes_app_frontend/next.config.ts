import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Preview/runtime uses `next start`, which is incompatible with `output: "export"`.
  // Keep default (server) output so the container can boot successfully.
};

export default nextConfig;
