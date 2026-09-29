import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Allow the built folder to be served from a subpath such as /dist/.
  base: './',
  plugins: [react()],
})
