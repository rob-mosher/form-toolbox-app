import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dotenv from 'dotenv'
import path from 'path'

// In case running outside of a Docker container, ensure the environment is referred to.
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.WEB_PORT || 5173,
    watch: {
      usePolling: true,
      interval: 100, // Polling interval (optional, default is 100ms)
    },
  },
})
