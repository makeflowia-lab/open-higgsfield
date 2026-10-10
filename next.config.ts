import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* The dev server prints every Server Function call with its arguments, and
     savePlatformCredentials takes the visitor's key — it would land in the
     terminal in plain text. */
  logging: { serverFunctions: false },
};

export default nextConfig;
