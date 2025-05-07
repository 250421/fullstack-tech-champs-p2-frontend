import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Routing
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';

// CSS
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
    react(),
    tailwindcss(),
  ],
})
