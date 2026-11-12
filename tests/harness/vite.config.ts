import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev server for the browser tests. Renders scenarios from src, not from dist.
export default defineConfig({ root: import.meta.dirname, plugins: [react()], server: { port: 6111, strictPort: true } });
