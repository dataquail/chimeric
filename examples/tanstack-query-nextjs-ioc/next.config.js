//@ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
  typescript: {
    tsconfigPath: './tsconfig.app.json',
  },
};

module.exports = nextConfig;
