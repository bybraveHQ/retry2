// Type definitions for @bybrave/retry2 (bundled — no separate @types needed).

export interface RetryOperation {
    /**
     * Returns an array of all errors that have been passed to
     * `retryOperation.retry()` so far, ordered chronologically.
     */
    errors(): Error[];

    /**
     * A reference to the error object that occurred most frequently. Errors are
     * compared using the `error.message` property. Returns `null` if no errors
     * occurred so far.
     */
    mainError(): Error | null;

    /**
     * Defines the function that is to be retried and executes it for the first
     * time right away.
     */
    attempt(fn: (currentAttempt: number) => void, timeoutOps?: AttemptTimeoutOptions): void;

    /**
     * Returns `false` when no `error` is given, or the maximum amount of retries
     * has been reached. Otherwise returns `true` and retries the operation after
     * the timeout for the current attempt number.
     */
    retry(err?: Error | null): boolean;

    /**
     * The delay in milliseconds before the next scheduled attempt, or `null` if
     * none has been scheduled yet. Useful for logging, e.g. "will retry in 16s".
     */
    getTimeout(): number | null;

    /** Stops the operation being retried. */
    stop(): void;

    /**
     * Resets the internal state of the operation object (attempts, remaining
     * timeouts, and accumulated errors) so it can be reused.
     */
    reset(): void;

    /** The number of attempts it took to call `fn` before it was successful. */
    attempts(): number;
}

export interface AttemptTimeoutOptions {
    /** A timeout in milliseconds. */
    timeout?: number | undefined;
    /** Callback to execute when the operation takes longer than the timeout. */
    cb?(): void;
}

export interface TimeoutsOptions {
    /** The maximum amount of times to retry the operation. Default 10. */
    retries?: number | undefined;
    /** The exponential factor to use. Default 2. */
    factor?: number | undefined;
    /** Milliseconds before starting the first retry. Default 1000. */
    minTimeout?: number | undefined;
    /** Maximum milliseconds between two retries. Default Infinity. */
    maxTimeout?: number | undefined;
    /** Randomizes the timeouts by multiplying a factor between 1-2. Default false. */
    randomize?: boolean | undefined;
}

export interface OperationOptions extends TimeoutsOptions {
    /** Whether to retry forever. Default false. */
    forever?: boolean | undefined;
    /** Whether to unref the setTimeout's. Default false. */
    unref?: boolean | undefined;
    /** The maximum time (ms) that the retried operation is allowed to run. Default Infinity. */
    maxRetryTime?: number | undefined;
}

/** Create a new RetryOperation object. */
export function operation(options?: OperationOptions | number[]): RetryOperation;

/** Returns an array of timeouts, all representing the time in milliseconds. */
export function timeouts(options?: TimeoutsOptions | number[]): number[];

/** Create a new timeout (in milliseconds) for a given attempt. */
export function createTimeout(attempt: number, opts: TimeoutsOptions): number;

/** Wrap all functions of the `obj` with retry logic. */
export function wrap(obj: object, options?: OperationOptions | string[], methods?: string[]): void;

declare const retry: {
    operation: typeof operation;
    timeouts: typeof timeouts;
    createTimeout: typeof createTimeout;
    wrap: typeof wrap;
};

export default retry;
