import { defineConfig, devices } from '@playwright/test';
import path from 'path';

const REPO_ROOT = path.resolve(__dirname, '..');

type ExampleConfig = {
  url: string;
  command: string;
};

const EXAMPLE_CONFIGS: Record<string, ExampleConfig> = {
  'tanstack-query-spa': {
    url: 'http://localhost:4200/tanstack-query-spa/',
    command: 'pnpm --filter @chimeric/tanstack-query-spa dev',
  },
  'rtk-spa': {
    url: 'http://localhost:4200/rtk-spa/',
    command: 'pnpm --filter @chimeric/rtk-spa dev',
  },
  'tanstack-query-nextjs-ioc': {
    url: 'http://localhost:3000/',
    command: 'pnpm --filter @chimeric/tanstack-query-nextjs-ioc dev',
  },
};

const exampleName = process.env.EXAMPLE ?? 'tanstack-query-spa';
const exampleConfig = EXAMPLE_CONFIGS[exampleName];

if (!exampleConfig) {
  throw new Error(
    `Unknown example: "${exampleName}". Valid options: ${Object.keys(EXAMPLE_CONFIGS).join(', ')}`
  );
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: exampleConfig.url,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
      },
    },
  ],
  webServer: [
    {
      command: 'npx nx serve @chimeric/express-backend',
      url: 'http://localhost:3333/api',
      reuseExistingServer: !process.env.CI,
      cwd: REPO_ROOT,
      timeout: 180_000,
    },
    {
      command: exampleConfig.command,
      url: exampleConfig.url,
      reuseExistingServer: !process.env.CI,
      cwd: REPO_ROOT,
      timeout: 120_000,
    },
  ],
});
