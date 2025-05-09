import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss()
  ],
  base: '/app/', // 👈 ESSENCIAL
  build: {
    outDir: 'dist',        // default
    rollupOptions: {
      input: 'index.html'  // 👈 certifica-te que está aqui
    }
  }
})
