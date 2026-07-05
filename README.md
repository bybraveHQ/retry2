# @bybrave/retry2

Maintained, drop-in fork of [`retry`](https://github.com/tim-kos/node-retry) — an abstraction for exponential-backoff retries of failing operations.

The original has had no release since 2021 (`0.13.1`) while still pulling ~450M downloads/month, with types living in a separate `@types/retry` (~133M/month). This fork **bundles the TypeScript types**, fixes an infinite-retries hang, and ships ESM. The API is unchanged.

```sh
npm install @bybrave/retry2
```

```js
const retry = require('@bybrave/retry2');        // CommonJS
import retry from '@bybrave/retry2';              // ESM (default)
import { operation, timeouts } from '@bybrave/retry2'; // ESM (named)
```

## What's fixed

| Issue | Problem | Fix |
|---|---|---|
| — | Types shipped separately as `@types/retry`. | **Types are bundled** — no extra install. |
| [#83](https://github.com/tim-kos/node-retry/issues/83) | Under TypeScript 4.4+, `import { timeouts } from 'retry'` compiled to an indirect call and broke because `timeouts()` relied on `this`. | `timeouts()` calls `createTimeout` directly — no `this`, so named imports work everywhere. |
| [#84](https://github.com/tim-kos/node-retry/issues/84) | `retries: Infinity` built an infinite-length timeouts array — a hang / out-of-memory. | `retries: Infinity` is treated as "retry forever" without precomputing an infinite array. |
| [#73](https://github.com/tim-kos/node-retry/issues/73) | No way to know how long until the next retry (for logging like "will retry in 16s"). | New `operation.getTimeout()` returns the scheduled delay in ms. |
| [#93](https://github.com/tim-kos/node-retry/issues/93) | `undefined` option values overrode the defaults (`{ retries: undefined }` → 0 retries). | `undefined` values are ignored, so defaults stand. |
| [#65](https://github.com/tim-kos/node-retry/issues/65) | `reset()` left accumulated errors in place. | `reset()` also clears the error list. |

`#60` (forever operations leaking errors) was already fixed in `0.13.1` and is verified by the tests here.

## `operation.getTimeout()`

Returns the delay in milliseconds before the next scheduled attempt (or `null` before the first retry), so you can log it:

```js
const op = retry.operation({ retries: 5 });
op.attempt(() => {
  doSomething((err) => {
    if (op.retry(err)) {
      console.warn(`request failed, retrying in ${op.getTimeout()}ms`);
      return;
    }
  });
});
```

## Migration from `retry`

Replace the dependency and the import, and remove `@types/retry` from your devDependencies — the types are built in. Everything behaves the same, plus the fixes above.

## Support

If this package saves you time, you can support maintenance:

[![Ko-fi](https://img.shields.io/badge/Ko--fi-buy%20me%20a%20coffee-FF5E5B?logo=kofi&logoColor=white)](https://ko-fi.com/bybrave)
[![Bitcoin](https://img.shields.io/badge/Bitcoin-BTC-F7931A?logo=bitcoin&logoColor=white)](#support)

Bitcoin (BTC): `bc1q37557q5jpeaxqydzwvf3jgj7zhnfpn2td3q40q`

## Credits & license

MIT, same as the original — see [LICENSE](./LICENSE).
Based on [node-retry](https://github.com/tim-kos/node-retry) by Tim Koschützki, Felix Geisendörfer and contributors.
