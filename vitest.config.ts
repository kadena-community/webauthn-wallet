import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [vanillaExtractPlugin(), react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
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
        lines: 11.02,
        functions: 18.81,
        branches: 30.11,
        statements: 11.02,
        autoUpdate: true,
      },
    },
    setupFiles: [path.resolve(__dirname, './tests/components/test-mocks.ts')],
  },
});
