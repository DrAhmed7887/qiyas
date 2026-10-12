import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: 'web',
  build: { outDir: '../dist', emptyOutDir: true },
  server: { fs: { allow: ['..'] }, proxy: { '/api': 'http://localhost:8787' } },
  preview: { proxy: { '/api': 'http://localhost:8787' } },
  test: {
    root: '.',
    include: ['tests/**/*.test.ts'],
    coverage: { provider: 'v8', include: ['web/src/growth/**'] },
  },
});
