import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  // Solución definitiva: Evita que Vite intente leer o compilar el archivo server.ts de backend
  build: {
    rollupOptions: {
      external: [
        /server\.ts/,
        'express',
        'ws',
        'http',
        'path'
      ]
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false
  }
});
