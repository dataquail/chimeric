import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/examples/tanstack-query-svelte-spa',
  server: {
    port: 4400,
    host: 'localhost',
  },
  preview: {
    port: 4500,
    host: 'localhost',
  },
  plugins: [svelte()],
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
  },
  resolve: {
    conditions: ['browser'],
    alias: {
      src: resolve(__dirname, './src'),
      '@chimeric/core': resolve(__dirname, '../../packages/core/src'),
      '@chimeric/svelte': resolve(__dirname, '../../packages/svelte/src'),
      '@chimeric/svelte-query': resolve(
        __dirname,
        '../../packages/svelte-query/src',
      ),
    },
  },
  base: '/tanstack-query-svelte-spa/',
}));
