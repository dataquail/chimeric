/// <reference types='vitest' />
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { copyFileSync } from 'fs';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/packages/testing',
  resolve: {
    alias: {
      '@chimeric/core': path.resolve(__dirname, '../core/src'),
      '@chimeric/react-query': path.resolve(__dirname, '../react-query/src'),
      '@chimeric/testing-core': path.resolve(__dirname, '../testing-core/src'),
    },
  },
  plugins: [
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
    }),
    {
      name: 'copy-assets',
      closeBundle() {
        // Copy package.json
        copyFileSync(
          path.join(__dirname, 'package.json'),
          path.join(__dirname, 'dist', 'package.json'),
        );
        // Copy README.md
        copyFileSync(
          path.join(__dirname, 'README.md'),
          path.join(__dirname, 'dist', 'README.md'),
        );
        // Copy LICENSE from root
        copyFileSync(
          path.join(__dirname, '../../LICENSE'),
          path.join(__dirname, 'dist', 'LICENSE'),
        );
      },
    },
  ],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  // Configuration for building your library.
  // See: https://vitejs.dev/guide/build.html#library-mode
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      // Could also be a dictionary or array of multiple entry points.
      entry: 'src/index.ts',
      name: '@chimeric/testing-react-query',
      fileName: (format) => `index.${format === 'es' ? 'esm' : 'cjs'}.js`,
      // Change this to the formats you want to support.
      // Don't forget to update your package.json as well.
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: [
        'react',
        'react-dom',
        '@chimeric/core',
        '@chimeric/react-query',
        '@chimeric/testing-core',
      ],
    },
  },
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
    },
  },
}));
