import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Sin sourcemaps en producción: que el código minificado no sea legible desde devtools.
    sourcemap: false,
    // Vite 8 usa "oxc" como minificador por defecto, que ignora `esbuild.drop`.
    // Forzamos esbuild para poder sacar console.log/debugger del bundle final.
    minify: 'esbuild',
  },
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
})