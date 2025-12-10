import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import commonjs from 'vite-plugin-commonjs'

export default defineConfig({
  plugins: [
    vue(),
    commonjs()
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },

  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: 'all',

    proxy: {
      // ⭐ Telebirr Proxy (Fixes CORS)
      '/telebirr': {
        target: 'http://78.47.138.239:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/telebirr/, '')
      }
    }
  },

  preview: {
    host: '0.0.0.0',
    port: 3000
  },

  optimizeDeps: {
    include: ['rtcpeerconnection-shim', 'sdp']
  },

  assetsInclude: ['**/*.PNG', '**/*.JPG', '**/*.jpeg', '**/*.gif', '**/*.svg']
})
