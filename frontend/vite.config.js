import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// PlurkoTech frontend — Vite + React, multi-page (one entry HTML per route).
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: false },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        solutions: resolve(__dirname, 'solutions.html'),
        products: resolve(__dirname, 'ip-core-products.html'),
        press: resolve(__dirname, 'blogs.html'),
        contact: resolve(__dirname, 'contact.html'),
        product: resolve(__dirname, 'product-pcie-gen5.html')
      }
    }
  }
})
