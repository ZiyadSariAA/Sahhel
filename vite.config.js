import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import viteCompression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
  ],
  server: {
    open: true, // يفتح المتصفح تلقائياً
    host: true, // يسمح بالوصول من الشبكة
    port: 5173,
  },
})
