import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://api.artic.edu",
        changeOrigin: true,
        headers: {
          "AIC-User-Agent": "CS554-Lab5 (chull1@stevens.edu)",
          Accept: "application/json",
        },
      },
      "/iiif": {
        target: "https://www.artic.edu",
        changeOrigin: true,
        headers: {
          "AIC-User-Agent": "CS554-Lab5 (chull1@stevens.edu)",
          Accept: "image/jpeg",
        },
      },
    },
  },
});
