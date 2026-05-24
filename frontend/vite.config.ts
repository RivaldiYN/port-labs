import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync } from 'fs'

// Plugin: copy index.html → 404.html after build (for SPA routing on static hosts)
const spaFallback = {
  name: 'spa-fallback',
  closeBundle() {
    try {
      copyFileSync('dist/index.html', 'dist/404.html')
      console.log('[vite] ✓ Copied dist/index.html → dist/404.html (SPA fallback)')
    } catch {
      // ignore if dist doesn't exist (e.g. during dev)
    }
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), spaFallback],
  server: { port: 5173, proxy: { '/api': 'http://localhost:3000' } },
})
