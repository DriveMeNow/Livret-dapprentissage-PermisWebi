import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Note : vite-plugin-pwa retiré car le chemin Windows avec apostrophe
// cassait workbox-build. Service worker écrit manuellement dans public/sw.js.
export default defineConfig({
  base: '/Livret-dapprentissage-PermisWebi/',
  plugins: [react()],
})
