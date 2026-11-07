import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-tokens',
      closeBundle() {
        mkdirSync('dist', { recursive: true });
        copyFileSync(resolve(import.meta.dirname, 'src/styles/tokens.css'), resolve(import.meta.dirname, 'dist/tokens.css'));
      },
    },
  ],
  build: {
    lib: {
      entry: { index: resolve(import.meta.dirname, 'src/index.ts'), flags: resolve(import.meta.dirname, 'src/flags/index.ts') },
      formats: ['es'],
      fileName: (_format, name) => `${name}.js`,
      cssFileName: 'styles',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'lucide-react', /^country-flag-icons/],
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
