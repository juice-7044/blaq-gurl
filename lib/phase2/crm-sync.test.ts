import { describe, expect, it } from 'vitest'
import { mergeMultiSelectValues } from './merge-utils'

describe('GHL contact MULTIPLE_OPTIONS merge', () => {
  it('preserves existing selections and adds incoming values', () => {
    expect(mergeMultiSelectValues(['Newsletter Subscriber', 'Past Traveler'], 'Trip Prospect')).toEqual(['Newsletter Subscriber', 'Past Traveler', 'Trip Prospect'])
  })
  it('deduplicates incoming values', () => {
    expect(mergeMultiSelectValues('Newsletter Subscriber', 'Newsletter Subscriber, Trip Prospect')).toEqual(['Newsletter Subscriber', 'Trip Prospect'])
  })
  it('handles empty, multiple, and malformed values safely', () => {
    expect(mergeMultiSelectValues(undefined, 'Trip Prospect, Past Traveler')).toEqual(['Trip Prospect', 'Past Traveler'])
    expect(mergeMultiSelectValues([], null)).toEqual([])
    expect(mergeMultiSelectValues({ value: 'unexpected' }, 'Trip Prospect')).toEqual(['Trip Prospect'])
  })
  it('preserves unrelated existing selections', () => {
    expect(mergeMultiSelectValues(['Newsletter Subscriber', 'Past Traveler'], 'Trip Prospect')).not.toContain('Newsletter Subscriber, Past Traveler')
  })
})
