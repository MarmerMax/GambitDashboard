import { useCallback, useMemo, useState } from 'react'
import type { Resource, ResourceFilters } from '../types'

const EMPTY_FILTERS: ResourceFilters = {
    search: '',
    provider: 'all',
    environment: 'all',
    criticality: 'all',
}

const matchesFilters = (resource: Resource, filters: ResourceFilters) => {
    const search = filters.search.trim().toLowerCase()

    return (
        (search === '' || resource.name.toLowerCase().includes(search)) &&
        (filters.provider === 'all' || resource.provider === filters.provider) &&
        (filters.environment === 'all' || resource.environment === filters.environment) &&
        (filters.criticality === 'all' || resource.criticality === filters.criticality)
    )
}

export const useResourceFilters = (resources: Resource[]) => {
    const [filters, setFilters] = useState<ResourceFilters>(EMPTY_FILTERS)

    const setFilter = useCallback(<Key extends keyof ResourceFilters>(key: Key, value: ResourceFilters[Key]) => {
        setFilters((current) => ({ ...current, [key]: value }))
    }, [])

    const resetFilters = useCallback(() => setFilters(EMPTY_FILTERS), [])

    const filteredResources = useMemo(
        () => resources.filter((resource) => matchesFilters(resource, filters)),
        [resources, filters],
    )

    const hasActiveFilters =
        filters.search !== '' ||
        filters.provider !== 'all' ||
        filters.environment !== 'all' ||
        filters.criticality !== 'all'

    return { filters, setFilter, resetFilters, filteredResources, hasActiveFilters }
}
