/// <reference types='vitest' />
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { copyFileSync, readFileSync, writeFileSync } from 'fs';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/packages/testing',
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
