import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-tokens',
      closeBundle() {
        mkdirSync('dist', { recursive: true });
        // dist/tokens.css = Figma variables (tokens.css) plus Figma effect styles (effects.css: shadows, focus rings).
        const read = (f: string) => readFileSync(resolve(import.meta.dirname, 'src/styles', f), 'utf8').trimEnd();
        writeFileSync(resolve(import.meta.dirname, 'dist/tokens.css'), `${read('tokens.css')}\n${read('effects.css')}\n`);
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
