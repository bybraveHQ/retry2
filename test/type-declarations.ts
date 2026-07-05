// Compile-only check of the bundled type declarations (tsc --noEmit --strict).
import retry, {operation, timeouts, createTimeout, wrap} from '../index.js'
import type {OperationOptions, RetryOperation} from '../index.js'

const opts: OperationOptions = {
    retries: 5,
    factor: 2,
    minTimeout: 1000,
    maxTimeout: Infinity,
    randomize: true,
    forever: false,
    unref: false,
    maxRetryTime: 60000,
}

const op: RetryOperation = operation(opts)
const op2: RetryOperation = operation([100, 200, 300])
const op3: RetryOperation = retry.operation({retries: 3})

const ts: number[] = timeouts({retries: 5})
const t: number = createTimeout(0, {minTimeout: 1000, factor: 2})

op.attempt((currentAttempt: number) => {
    void currentAttempt
})

const didRetry: boolean = op.retry(new Error('x'))
const pending: number | null = op.getTimeout()
const errs: Error[] = op.errors()
const main: Error | null = op.mainError()
const n: number = op.attempts()
op.reset()
op.stop()

const obj = {foo: (cb: () => void) => cb()}
wrap(obj, {retries: 2})

void [op2, op3, ts, t, didRetry, pending, errs, main, n]
