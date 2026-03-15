import '@js-temporal/polyfill'

declare global {
  // Re-export the polyfill's Temporal namespace globally
  const Temporal: typeof import('@js-temporal/polyfill').Temporal
}
