/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/examples/basic-todo-app',
  server: {
    port: 4200,
    host: 'localhost',
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  plugins: [
    react(),
    {
      name: 'configure-msw',
      configureServer(server) {
        // During development, serve mockServiceWorker.js from the root
        server.middlewares.use((req, res, next) => {
          if (req.url === '/mockServiceWorker.js') {
            const workerPath = resolve(
              './node_modules/msw/lib/mockServiceWorker.js',
            );
            if (fs.existsSync(workerPath)) {
              res.setHeader('Content-Type', 'application/javascript');
              res.end(fs.readFileSync(workerPath, 'utf8'));
              return;
            }
          }
          next();
        });
      },
      writeBundle() {
        // For production build, copy mockServiceWorker.js to the dist folder root
        const workerPath = resolve(
          './node_modules/msw/lib/mockServiceWorker.js',
        );
        const outputPath = resolve('./dist/mockServiceWorker.js');
        if (fs.existsSync(workerPath)) {
          fs.copyFileSync(workerPath, outputPath);
        }
      },
    },
  ],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
    },
  },
  resolve: {
    alias: {
      src: resolve(__dirname, './src'),
      '@tanstack/react-query': resolve(
        __dirname,
        './node_modules/@tanstack/react-query',
      ),
      '@testing-library/react': resolve(
        __dirname,
        './node_modules/@testing-library/react',
      ),
    },
  },
  base: '/basic-todo-app/',
}));
