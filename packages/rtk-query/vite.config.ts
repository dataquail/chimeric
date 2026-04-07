/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types='vitest' />
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { copyFileSync, readFileSync, writeFileSync } from 'fs';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/packages/rtk-query',
  plugins: [
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
    }),
    {
      name: 'copy-assets',
      closeBundle() {
        // Copy and transform package.json for publishing
        const packageJsonPath = path.join(__dirname, 'package.json');
        const distPackageJsonPath = path.join(
          __dirname,
          'dist',
          'package.json',
        );

        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

        // Transform paths for publishing (remove dist/ prefix)
        if (packageJson.main) {
          packageJson.main = packageJson.main.replace(/^(\.\/)?dist\//, './');
        }
        if (packageJson.module) {
          packageJson.module = packageJson.module.replace(
            /^(\.\/)?dist\//,
            './',
          );
        }
        if (packageJson.typings) {
          packageJson.typings = packageJson.typings.replace(
            /^(\.\/)?dist\//,
            './',
          );
        }
        if (packageJson.exports) {
          // Transform exports paths recursively
          const transformExports = (obj: any): any => {
            if (
              typeof obj === 'string' &&
              (obj.startsWith('dist/') || obj.startsWith('./dist/'))
            ) {
              return obj.replace(/^(\.\/)?dist\//, './');
            }
            if (typeof obj === 'object' && obj !== null) {
              const result: any = {};
              for (const [key, value] of Object.entries(obj)) {
                result[key] = transformExports(value);
              }
              return result;
            }
            return obj;
          };

          packageJson.exports = transformExports(packageJson.exports);
        }

        writeFileSync(
          distPackageJsonPath,
          JSON.stringify(packageJson, null, 2),
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
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: {
        index: 'src/index.ts',
      },
      name: '@chimeric/rtk-query',
      fileName: (format, entryName) =>
        `${entryName}.${format === 'es' ? 'esm' : 'cjs'}.js`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react-redux',
        '@chimeric/core',
        '@reduxjs/toolkit',
        '@reduxjs/toolkit/query',
        '@reduxjs/toolkit/query/react',
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
