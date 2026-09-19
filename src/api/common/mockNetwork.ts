const MIN_LATENCY_MS = 220
const MAX_LATENCY_MS = 620
const CURSOR_PREFIX = "offset:"

export const ABORT_ERROR_NAME = "AbortError"

export const isAbortError = (error: unknown) =>
    error instanceof Error && error.name === ABORT_ERROR_NAME

const createAbortError = () => {
    const error = new Error("Request aborted")
    error.name = ABORT_ERROR_NAME

    return error
}

export const simulateLatency = (signal?: AbortSignal) =>
    new Promise<void>((resolve, reject) => {
        if (signal?.aborted) {
            reject(createAbortError())

            return
        }

        const latency = MIN_LATENCY_MS + Math.random() * (MAX_LATENCY_MS - MIN_LATENCY_MS)
        const timer = window.setTimeout(() => {
            signal?.removeEventListener("abort", handleAbort)
            resolve()
        }, latency)

        function handleAbort() {
            window.clearTimeout(timer)
            reject(createAbortError())
        }

        signal?.addEventListener("abort", handleAbort, { once: true })
    })

export const encodeCursor = (offset: number) => window.btoa(`${CURSOR_PREFIX}${offset}`)

export const decodeCursor = (token?: string) => {
    if (!token) return 0

    const decoded = window.atob(token)

    if (!decoded.startsWith(CURSOR_PREFIX)) throw new Error("Invalid pagination token")

    const offset = Number(decoded.slice(CURSOR_PREFIX.length))

    if (!Number.isInteger(offset) || offset < 0) throw new Error("Invalid pagination token")

    return offset
}
