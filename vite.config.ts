import path from 'path';
import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';
import react from '@vitejs/plugin-react';
import topLevelAwait from 'vite-plugin-top-level-await';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), wasm(), topLevelAwait()],
  server: {
    https: {
      key: fs.readFileSync('localhost-key.pem'),
      cert: fs.readFileSync('localhost.pem'),
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
