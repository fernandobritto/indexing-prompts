import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent Next.js from bundling these Node.js-only packages for the server.
  // They will be loaded as CommonJS modules at runtime by the API routes.
  serverExternalPackages: ["nspell", "dictionary-en-us"],
};

export default nextConfig;
