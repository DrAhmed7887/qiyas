import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: 'web',
  build: { outDir: '../dist', emptyOutDir: true },
  server: { fs: { allow: ['..'] } },
  test: {
    root: '.',
    include: ['tests/**/*.test.ts'],
    coverage: { provider: 'v8', include: ['web/src/growth/**'] },
  },
});
