/// <reference types="vitest/config" />
import { copyFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { palette } from './src/theme/palette';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      // GitHub Pages serves 404.html for unknown paths: this lets QR links (`<base>Q/…`) open the app
      name: 'stf-404-fallback',
      apply: 'build',
      writeBundle: ({ dir }) => copyFileSync(`${dir}/index.html`, `${dir}/404.html`)
    },
    {
      name: 'stf-theme-color',
      transformIndexHtml: (html) => html.replace('%STF_THEME_COLOR%', palette.accent200)
    }
  ],
  server: {
    port: 3022,
  },
  build: {
    outDir: './build',
  },
  base: '/state-to-function/',
  resolve: {
    alias: {
      src: '/src',
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    passWithNoTests: true,
  },
});
