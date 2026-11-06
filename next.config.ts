import type { NextConfig } from "next";

/**
 * The site is exported as static files (`out/`) so it can be hosted on GitHub
 * Pages or any static host. On GitHub Pages the workflow sets
 * NEXT_PUBLIC_BASE_PATH to "/<repository-name>"; it stays empty for a custom
 * domain and for local development.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") || undefined;

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  poweredByHeader: false,
  images: {
    // Static hosting has no image optimiser; this loader requests correctly sized images from the source.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
