import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.test.ts']
  },
  server: {
    port: 5178,
    open: false
  }
})
