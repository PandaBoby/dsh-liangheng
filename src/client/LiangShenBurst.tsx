/**
 * The jackpot overlay: flash, shockwave rings, sparks, and the banner.
 *
 * It plays when the preset picker above the composer lands on LiangHeng mode —
 * there is no control here to operate. The slot entry paints nothing while idle
 * (the overlay is viewport-fixed and pointer-transparent), so the composer row
 * stays exactly as the host drew it.
 */

import { useEffect, useRef, useState, useSyncExternalStore, type ReactElement } from 'react'
import type { BurstFace } from './preset-watcher.ts'
import css from './LiangShenBurst.module.css'

/** How long the burst overlay stays mounted, matching its CSS duration. */
const BURST_MS = 2200

/** Jackpot lines that read the same in every language. */
const PIPELINE = 'INTENT · INVARIANTS · VERIFIED DIFF'
const STANDARD = 'FIRST-PRINCIPLES · HONEST · FAST'

/** One spark per spoke of the burst. */
const SPARKS = Array.from({ length: 14 }, (_, index) => index)

/** Slot entry for `conversation.input.right`: the overlay, and nothing else. */
export function LiangShenBurst(face: BurstFace): ReactElement | null {
  const snapshot = useSyncExternalStore(face.store.subscribe, face.store.getSnapshot)
  const { burst } = snapshot
  const [burstKey, setBurstKey] = useState(0)
  const seen = useRef(burst)

  // The counter is owned by the watcher, so a reload or a refresh can never
  // replay the burst: only a rise above the last seen value starts one.
  useEffect(() => {
    if (burst > seen.current) setBurstKey(burst)
    seen.current = burst
  }, [burst])

  useEffect(() => {
    if (burstKey === 0) return
    const timer = setTimeout(() => { setBurstKey(0) }, BURST_MS)
    return () => { clearTimeout(timer) }
  }, [burstKey])

  if (burstKey === 0) return null
  return <Burst key={burstKey} face={face} />
}

/** The overlay itself: flash, three rings, the banner, and fourteen sparks. */
function Burst({ face }: { face: BurstFace }): ReactElement {
  return (
    <span className={css.burst} data-dsh-part="lever-burst" aria-hidden="true">
      <span className={css.flash} />
      <span className={css.ring} />
      <span className={css.ring} />
      <span className={css.ring} />
      <span className={css.banner} data-dsh-part="lever-banner">
        <span className={css.bannerName}>{face.t('lever.name')}</span>
        <span className={css.line}>{face.t('burst.line1')}</span>
        <span className={css.line}>{face.t('burst.line2')}</span>
        <span className={css.code}>{PIPELINE}</span>
        <span className={css.code}>{STANDARD}</span>
      </span>
      <span className={css.sparks}>
        {SPARKS.map(spoke => (
          // `rotate` is its own property so the keyframes' translate runs along
          // the spoke after the rotation composes with it.
          <i key={spoke} className={css.spark} style={{ rotate: `${spoke * (360 / SPARKS.length)}deg` }} />
        ))}
      </span>
    </span>
  )
}
