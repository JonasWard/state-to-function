/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { palette } from './src/theme/palette';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
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
  base: '/',
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
