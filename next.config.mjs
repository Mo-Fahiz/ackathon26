// GitHub Pages serves this repo from https://<user>.github.io/<repo>/, so the build needs
// to know that subpath. The deploy workflow sets NEXT_PUBLIC_BASE_PATH=/ackathon26;
// locally it is unset, so dev and `npm run build` stay rooted at /.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath,
  assetPrefix: basePath,
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
