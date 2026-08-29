import { describe, expect, it } from 'vitest'
import { requireIsolatedTestDatabase } from './database-harness'

describe('Phase II database harness', () => {
  it('refuses to run without an isolated database URL', () => {
    const previous = process.env.PHASE2_TEST_DATABASE_URL
    delete process.env.PHASE2_TEST_DATABASE_URL
    expect(() => requireIsolatedTestDatabase()).toThrow('isolated database')
    if (previous) process.env.PHASE2_TEST_DATABASE_URL = previous
  })
})
