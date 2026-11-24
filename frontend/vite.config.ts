import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

declare const process: { env: Record<string, string | undefined> };

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const apiTarget = process.env.API_PROXY_TARGET || env.API_PROXY_TARGET || 'http://127.0.0.1:8000';
  const locationsTarget = process.env.LOCATIONS_API_TARGET || env.LOCATIONS_API_TARGET || 'https://nav-backend-eight.vercel.app';

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      proxy: {
        '/api/locations': {
          target: locationsTarget,
          changeOrigin: true,
        },
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
