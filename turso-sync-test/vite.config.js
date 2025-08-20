import { defineConfig, searchForWorkspaceRoot } from 'vite'

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
  server: {
    fs: {
      allow: ['.']
    },
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    }
  },
  optimizeDeps: {
      exclude: [
          "@tursodatabase/database-wasm32-wasi",
      ]
  },
})
