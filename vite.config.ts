import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Use relative base so built assets work when the site is hosted under a repository path
  // (GitHub Pages project sites). This makes assets use './assets/...' instead of '/assets/...'.
  base: './',
  plugins: [react()],
})
