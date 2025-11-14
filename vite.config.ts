import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      include: '**/*.svg?react',
    }),
  ],
  resolve: {
    alias: {
      '@root': path.resolve(__dirname, './'),
      '@components': path.resolve(__dirname, './src/components'),
      '@scripts': path.resolve(__dirname, './src/scripts'),
      '@css': path.resolve(__dirname, './src/css'),
    },
  },
});
