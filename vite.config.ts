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
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js',
      cssFileName: 'styles',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'lucide-react'],
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
