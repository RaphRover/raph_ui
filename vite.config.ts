import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import svgr from 'vite-plugin-svgr';
import packageJson from './package.json' with { type: 'json' };
import { execSync } from 'child_process';

function getGitVersion() {
  try {
    const version = execSync('git describe --tags --always').toString().trim();
    return version;
  } catch {
    console.warn('Could not get git version, falling back to package.json');
    return packageJson.version;
  }
}

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
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    __APP_NAME__: JSON.stringify(packageJson.name),
    __APP_DISPLAY_NAME__: JSON.stringify(packageJson.displayName),
    __APP_VERSION__: JSON.stringify(getGitVersion()),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    __BUILD_YEAR__: new Date().getFullYear(),
    __REPOSITORY_URL__: JSON.stringify(packageJson.repository),
  },
});
