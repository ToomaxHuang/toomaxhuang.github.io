import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  server: {
    port: 8080
  },
  define: {
    "process.env": {
      "BASE_URL": "./"
    }
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: resolve(__dirname, "src")
      }
    ]
  }
})
