import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(() => {
  /** 本地后端固定 8080；与 src/config/api.ts 开发默认值一致 */
  const devApiTarget = 'http://localhost:8080'

  return {
    plugins: [react()],
    base: '/firstGo/',
    server: {
      proxy: {
        '/api': {
          target: devApiTarget,
          changeOrigin: true,
        },
        '/health': {
          target: devApiTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
