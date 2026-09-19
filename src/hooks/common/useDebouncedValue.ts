import { useEffect, useState } from "react"

export const useDebouncedValue = <Value>(value: Value, delayMs: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const timer = window.setTimeout(() => setDebouncedValue(value), delayMs)

        return () => window.clearTimeout(timer)
    }, [value, delayMs])

    return debouncedValue
}
