import { useCallback, useState } from "react"
import type { Resource } from "@src/types"

export const useResourceCache = () => {
    const [resourcesById, setResourcesById] = useState<Record<string, Resource>>({})

    const registerResources = useCallback((resources: Resource[]) => {
        setResourcesById((current) => {
            const unseen = resources.filter((resource) => !current[resource.id])
            console.log("unseen", unseen)

            if (unseen.length === 0) return current

            return {
                ...current,
                ...Object.fromEntries(unseen.map((resource) => [resource.id, resource])),
            }
        })
    }, [])

    const getResources = useCallback(
        (ids: string[]) => {
            return ids
                .map((id) => resourcesById[id])
                .filter((resource): resource is Resource => resource !== undefined)
        },
        [resourcesById],
    )

    return { registerResources, getResources }
}
