import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [vanillaExtractPlugin(), react()],
  resolve: {
    alias: {
      '@': '/src', // Needs to be absolute to make mocks work ¯\_(ツ)_/¯
    },
  },
  test: {
    include: ['{src,tests}/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    environment: 'jsdom',
    env: {
      NAMESPACE: 'n_eef68e581f767dd66c4d4c39ed922be944ede505',
    },
    coverage: {
      enabled: true,
      provider: 'v8',
      thresholds: {
        lines: 9.95,
        functions: 18.33,
        branches: 33.5,
        statements: 9.95,
        autoUpdate: true,
      },
    },
    setupFiles: ['./tests/components/test-mocks.ts'],
  },
});