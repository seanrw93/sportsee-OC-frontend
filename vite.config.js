import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    base: '/',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      proxy: {
<<<<<<< Updated upstream
        '/api': 'https://sportsee-backend-j2dr.onrender.com/',
=======
        '/api': '${import.meta.env.VITE_API_URL || 'http://localhost:3000'}',
>>>>>>> Stashed changes
      },
    },
    build: {
      outDir: 'dist/',
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name].[hash].[ext]',
          chunkFileNames: 'assets/[name].[hash].js',
          entryFileNames: 'assets/[name].[hash].js',
        },
      },
    },
  };
});