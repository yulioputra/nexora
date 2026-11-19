import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Root deployment is intended for the planned custom domain (example: nexora.my.id).
// If deploying only to username.github.io/repository, change base to '/repository/'.
export default defineConfig({
  plugins: [react()],
  base: '/',
})
