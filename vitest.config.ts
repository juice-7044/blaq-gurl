import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  resolve: { alias: { '@': path.resolve(__dirname, '.'), 'server-only': path.resolve(__dirname, 'lib/phase2/server-only-test-shim.ts') } },
  test: { environment: 'node' },
})
