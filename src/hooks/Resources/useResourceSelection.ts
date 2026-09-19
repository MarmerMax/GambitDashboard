import { useCallback, useState } from "react"

export const useResourceSelection = () => {
    const [selectedIds, onSetSelectedIds] = useState<string[]>([])

    const handleClearSelectedIds = useCallback(() => onSetSelectedIds([]), [])

    return { selectedIds, onSetSelectedIds, onClearSelectedIds: handleClearSelectedIds }
}
