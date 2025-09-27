import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredFiles: [
            '{projectRoot}/eslint.config.{js,cjs,mjs}',
            '{projectRoot}/vite.config.{js,ts,mjs,mts}',
            '{projectRoot}/setupTests.ts',
            '{projectRoot}/src/lib/__tests__/*.tsx',
            '{projectRoot}/src/lib/__tests__/*.ts',
            '{projectRoot}/**/*.spec.{ts,tsx}',
            '{projectRoot}/**/*.test.{ts,tsx}',
          ],
        },
      ],
    },
    languageOptions: {
      parser: await import('jsonc-eslint-parser'),
    },
  },
];
