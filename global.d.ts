// global.d.ts (or src/types/temporal.d.ts)

import '@js-temporal/polyfill'
import type { Temporal as TemporalPolyfill } from '@js-temporal/polyfill'

declare global {
  const Temporal: typeof TemporalPolyfill
  namespace Temporal {
    export type PlainDate = Temporal.PlainDate
    export type PlainMonthDay = Temporal.PlainMonthDay
    export type PlainTime = Temporal.PlainTime
    export type PlainDateTime = Temporal.PlainDateTime
    export type ZonedDateTime = Temporal.ZonedDateTime
    export type Duration = Temporal.Duration
    export type Instant = Temporal.Instant
    export type Now = Temporal.Now
    export type Calendar = Temporal.Calendar
    export type TimeZone = Temporal.TimeZone
  }
}
