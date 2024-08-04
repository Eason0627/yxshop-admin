import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  server: {
    proxy: {
      '/upload': {
        target: 'http://localhost:8080',  // 后端服务器地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/upload/, '')  // 移除路径前缀
      }
    }
  },
  resolve: {
    alias: {
      '@':path.resolve(__dirname, 'src'),
    }
  },
})
