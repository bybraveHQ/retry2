import {test} from 'node:test'
import assert from 'node:assert'
import {operation, timeouts, createTimeout} from '../index.js'

// #84 — retries: Infinity must not hang building an infinite array.
test('#84: timeouts({retries: Infinity}) returns quickly', () => {
    const start = Date.now()
    const result = timeouts({retries: Infinity})
    assert.ok(Date.now() - start < 50)
    assert.strictEqual(result.length, 1)
})

test('#84: operation({retries: Infinity}) is a forever operation', () => {
    const op = operation({retries: Infinity})
    assert.strictEqual(typeof op.retry, 'function')
    op.stop()
})

// #93 — undefined option values must not override defaults.
test('#93: undefined retries keeps the default of 10', () => {
    assert.strictEqual(timeouts({retries: undefined}).length, 10)
})

test('#93: undefined factor keeps the default', () => {
    const withUndef = timeouts({factor: undefined, retries: 2, randomize: false})
    const baseline = timeouts({retries: 2, randomize: false})
    assert.deepStrictEqual(withUndef, baseline)
})

// #73 — getTimeout() exposes the scheduled delay.
test('#73: getTimeout() returns the next scheduled delay', () => {
    const op = operation({retries: 3, minTimeout: 100, factor: 1, randomize: false})
    op.attempt(() => {})
    op.retry(new Error('boom'))
    assert.strictEqual(op.getTimeout(), 100)
    op.stop()
})

test('#73: getTimeout() is null before any retry', () => {
    const op = operation({retries: 3})
    assert.strictEqual(op.getTimeout(), null)
    op.stop()
})

// #65 — reset() clears accumulated errors.
test('#65: reset() clears the error list', () => {
    const op = operation({retries: 2, minTimeout: 1})
    op.attempt(() => {})
    op.retry(new Error('a'))
    assert.strictEqual(op.errors().length, 1)
    op.reset()
    assert.strictEqual(op.errors().length, 0)
    op.stop()
})

// #83 — timeouts works when called indirectly (no reliance on `this`).
test('#83: timeouts works as an indirect (detached) call', () => {
    const detached = timeouts
    assert.strictEqual(detached({retries: 4, randomize: false}).length, 4)
})

test('#83: createTimeout is a standalone function', () => {
    assert.strictEqual(
        createTimeout(0, {minTimeout: 100, factor: 2, maxTimeout: Infinity, randomize: false}),
        100,
    )
})
