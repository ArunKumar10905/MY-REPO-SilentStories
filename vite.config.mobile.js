import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3004',
        changeOrigin: true
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion']
  },
  build: {
    rollupOptions: {
      input: './index.html',
      // Optimize heavily for mobile performance
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'lucide-react'],
          firebase: ['./src/firebase/firebase']
        }
      }
    },
    // Aggressive optimization for mobile
    chunkSizeWarningLimit: 500,
    // Heavy minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.info', 'console.debug', 'console.warn']
      },
      mangle: true,
      format: {
        comments: false
      }
    }
  },
  // Mobile-specific optimizations
  base: './',
  esbuild: {
    drop: ['console', 'debugger']
  }
});