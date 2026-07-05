# Changelog

Maintained fork of [tim-kos/node-retry](https://github.com/tim-kos/node-retry) (no upstream release since 2021). The public API is unchanged.

## 1.0.0 — 2026-07-05

### Added

- Bundled TypeScript types — no separate `@types/retry` (~133M downloads/month) needed.
- `operation.getTimeout()` returns the milliseconds until the next scheduled attempt, useful for logging such as "will retry in 16s" ([#73](https://github.com/tim-kos/node-retry/issues/73)).
- ESM support via an `exports` map, alongside CommonJS.

### Fixed

- `retries: Infinity` no longer hangs while building an infinite array; it is now treated as retry-forever ([#84](https://github.com/tim-kos/node-retry/issues/84)).
- `timeouts()` no longer relies on `this`, so `import { timeouts }` works under TypeScript 4.4+ indirect calls ([#83](https://github.com/tim-kos/node-retry/issues/83)).
- `undefined` option values no longer clobber defaults ([#93](https://github.com/tim-kos/node-retry/issues/93)).
- `reset()` now also clears the accumulated error list ([#65](https://github.com/tim-kos/node-retry/issues/65)).
