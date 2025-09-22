import { defineConfig } from 'vite';  
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    proxy: {
      '/api': {
        target: 'https://pedidos.automuellesdiesel.com',
        changeOrigin: true,
        secure: true,
        // secure: false,
      },
      '/sanctum': {
        target: 'https://pedidos.automuellesdiesel.com',
        changeOrigin: true,
        secure: true,
        // secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});