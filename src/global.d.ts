// global.d.ts (or src/types/temporal.d.ts)

import '@js-temporal/polyfill'
import type { Temporal as TemporalPolyfill } from '@js-temporal/polyfill'

declare global {
  const Temporal: typeof TemporalPolyfill
  namespace Temporal {
    export type PlainDate = TemporalPolyfill.PlainDate
    export type PlainMonthDay = TemporalPolyfill.PlainMonthDay
    export type PlainTime = TemporalPolyfill.PlainTime
    export type PlainDateTime = TemporalPolyfill.PlainDateTime
    export type ZonedDateTime = TemporalPolyfill.ZonedDateTime
    export type Duration = TemporalPolyfill.Duration
    export type Instant = TemporalPolyfill.Instant
    export type Now = TemporalPolyfill.Now
    export type Calendar = TemporalPolyfill.Calendar
    export type TimeZone = TemporalPolyfill.TimeZone
  }
}
