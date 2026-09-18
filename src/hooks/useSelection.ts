import { useCallback, useState } from 'react'

export const useSelection = () => {
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    const toggle = useCallback((id: string) => {
        setSelectedIds((current) =>
            current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id],
        )
    }, [])

    const toggleMany = useCallback((ids: string[], shouldSelect: boolean) => {
        setSelectedIds((current) => {
            if (!shouldSelect) return current.filter((selectedId) => !ids.includes(selectedId))

            const missing = ids.filter((id) => !current.includes(id))

            return [...current, ...missing]
        })
    }, [])

    const clear = useCallback(() => setSelectedIds([]), [])

    return { selectedIds, toggle, toggleMany, clear }
}
