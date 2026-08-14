import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/train': 'http://127.0.0.1:8000',
      '/predict': 'http://127.0.0.1:8000',
      '/history': 'http://127.0.0.1:8000',
    },
  },
})
