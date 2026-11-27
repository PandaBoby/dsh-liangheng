import { describe, expect, it } from 'vitest'
import { imageFileName, planPullBack, pullBackSupported } from './queue-pullback.ts'

describe('planPullBack', () => {
  it('joins text blocks and keeps image references in order', () => {
    const plan = planPullBack([
      { type: 'image', attachment: { attachmentId: 'sha-1', mediaType: 'image/png', bytes: 12, width: 2, height: 2 } },
      { type: 'text', text: '第一段 ' },
      { type: 'text', text: '第二段' },
    ])
    expect(plan.text).toBe('第一段 第二段')
    // The reference is the row's own wire object, so only the read fields are asserted.
    expect(plan.images.map(image => image.attachmentId)).toEqual(['sha-1'])
    expect(plan.images[0]?.mediaType).toBe('image/png')
    expect(plan.files).toEqual([])
    expect(pullBackSupported(plan)).toBe(true)
  })

  it('refuses a row carrying a durable file the composer cannot re-open', () => {
    const plan = planPullBack([
      { type: 'text', text: '看看这个' },
      { type: 'file', attachment: { attachmentId: 'sha-2', name: 'report.pdf', bytes: 99 } },
    ])
    expect(plan.files.map(file => [file.attachmentId, file.name])).toEqual([['sha-2', 'report.pdf']])
    expect(pullBackSupported(plan)).toBe(false)
  })

  it('skips wire blocks it cannot address instead of trusting them', () => {
    const plan = planPullBack([
      { type: 'image' },
      { type: 'image', attachment: { mediaType: 'image/png' } },
      { type: 'file', attachment: { attachmentId: 'sha-3' } },
      { type: 'image', attachment: { attachmentId: 'sha-4', mediaType: 'image/webp', name: 'shot.webp' } },
    ])
    expect(plan.images.map(image => [image.attachmentId, image.mediaType, image.name])).toEqual([
      ['sha-4', 'image/webp', 'shot.webp'],
    ])
    expect(plan.files).toEqual([])
    expect(pullBackSupported(plan)).toBe(true)
  })

  it('reports an attachment-only row as supported with empty text', () => {
    const plan = planPullBack([
      { type: 'image', attachment: { attachmentId: 'sha-5', mediaType: 'image/jpeg' } },
    ])
    expect(plan.text).toBe('')
    expect(pullBackSupported(plan)).toBe(true)
  })
})

describe('imageFileName', () => {
  it('keeps a real upload name', () => {
    expect(imageFileName({ attachmentId: 'sha-1', mediaType: 'image/png', name: '截图 1.png' })).toBe('截图 1.png')
  })

  it('derives a placeholder from the media type', () => {
    expect(imageFileName({ attachmentId: 'sha-1', mediaType: 'image/webp' })).toBe('image.webp')
    expect(imageFileName({ attachmentId: 'sha-1', mediaType: 'image' })).toBe('image.png')
  })
})
