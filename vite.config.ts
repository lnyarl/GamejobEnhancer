import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import manifest from './src/manifest.json'

export default defineConfig(({ mode }) => ({
  plugins: [crx({ manifest })],
  server: {
    cors: {
      origin: [/chrome-extension:\/\//],
    },
  },
  define: {
    __GJ_DEV__: JSON.stringify(mode !== 'production'),
  },
}))
