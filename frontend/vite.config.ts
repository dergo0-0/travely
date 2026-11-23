import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

declare const process: { env: Record<string, string | undefined> };

export default defineConfig(() => {
  const apiTarget = process.env.API_PROXY_TARGET || 'http://127.0.0.1:8000';

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          headers: { host: 'localhost:8000' },
        },
      },
    },
  };
});
