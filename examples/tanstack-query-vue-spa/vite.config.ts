import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/examples/tanstack-query-vue-spa',
  server: {
    port: 4210,
    host: 'localhost',
  },
  preview: {
    port: 4310,
    host: 'localhost',
  },
  plugins: [vue()],
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  resolve: {
    alias: {
      src: resolve(__dirname, './src'),
      '@chimeric/core': resolve(__dirname, '../../packages/core/src'),
      '@chimeric/vue': resolve(__dirname, '../../packages/vue/src'),
      '@chimeric/vue-query': resolve(
        __dirname,
        '../../packages/vue-query/src',
      ),
    },
  },
  base: '/tanstack-query-vue-spa/',
}));
