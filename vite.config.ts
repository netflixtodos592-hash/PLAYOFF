import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Configuración optimizada para producción en Vercel
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  build: {
    chunkSizeWarningLimit: 1000, // Evita alertas por el tamaño de las librerías de streaming
    sourcemap: false // Acelera la compilación en la nube
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' } // Silencia alertas de React 19
  }
});
