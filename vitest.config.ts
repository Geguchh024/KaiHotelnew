import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    projects: [
      {
        // Convex backend tests — run in edge-runtime to match Convex runtime
        extends: true,
        test: {
          name: 'convex',
          include: ['convex/**/*.test.{ts,js}'],
          environment: 'edge-runtime',
          server: {
            deps: {
              inline: ['convex-test'],
            },
          },
        },
      },
      {
        // Frontend / utility tests — run in jsdom for browser-like APIs
        extends: true,
        test: {
          name: 'frontend',
          include: ['src/**/*.test.{ts,tsx,js,jsx}'],
          environment: 'jsdom',
        },
      },
    ],
  },
})
