import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const devApiTarget =
    env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:8080'

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
