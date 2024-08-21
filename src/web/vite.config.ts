import react from '@vitejs/plugin-react-swc'
import dotenv from 'dotenv'
import { defineConfig } from 'vite'
import path from 'path'

// In case running outside of a Docker container, ensure the environment is referred to.
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

if (!process.env.WEB_PORT) throw new Error('Missing WEB_PORT environment variable.')

const WEB_PORT = Number(process.env.WEB_PORT)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: WEB_PORT,
    watch: {
      usePolling: true,
      interval: 100, // Polling interval (optional, default is 100ms)
    },
  },
})
