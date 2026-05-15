import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    tanstackStart(),
    viteReact(),
    tailwindcss(),
  ],
  build: {
    // Target modern browsers for smaller bundles
    target: 'es2020',
    // Enable CSS code splitting per route
    cssCodeSplit: true,
    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Only split vendor chunks for client builds (not SSR)
          if (!id.includes('node_modules')) return undefined
          if (id.includes('react-dom') || id.includes('/react/')) return 'vendor-react'
          if (id.includes('@tanstack/react-router') || id.includes('@tanstack/react-start')) return 'vendor-router'
          if (id.includes('convex')) return 'vendor-convex'
          if (id.includes('date-fns')) return 'vendor-date'
          if (id.includes('lucide-react') || id.includes('class-variance-authority') || id.includes('clsx') || id.includes('tailwind-merge')) return 'vendor-ui'
          return undefined
        },
        // Content-hash filenames for long-term caching
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'chunks/[name]-[hash].js',
        entryFileNames: 'entries/[name]-[hash].js',
      },
    },
    // Inline small assets as data URLs (< 8KB)
    assetsInlineLimit: 8192,
  },
})
