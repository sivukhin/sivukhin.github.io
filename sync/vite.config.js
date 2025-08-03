import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    },
    fs: {
      allow: ['.']
    }
  },
  optimizeDeps: {
    exclude: ['@napi-rs/wasm-runtime']
  }
})
