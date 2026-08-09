import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: './', // 🚀 CORRECCIÓN: Fuerza a Vite a usar rutas relativas para que no cargue en blanco
  plugins: [
    react(),
    tailwindcss()
  ],
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
