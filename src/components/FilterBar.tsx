import type { ChangeEvent } from 'react'
import { useCallback } from 'react'
import { CRITICALITIES, ENVIRONMENTS, PROVIDERS } from '../types'
import type { Criticality, Environment, FilterValue, Provider, ResourceFilters } from '../types'
import { FilterSelect } from './FilterSelect'

interface FilterBarProps {
    filters: ResourceFilters
    onChange: <Key extends keyof ResourceFilters>(key: Key, value: ResourceFilters[Key]) => void
    onReset: () => void
    hasActiveFilters: boolean
}

export const FilterBar = ({ filters, onChange, onReset, hasActiveFilters }: FilterBarProps) => {
    const handleSearch = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => onChange('search', event.target.value),
        [onChange],
    )

    const handleProvider = useCallback(
        (value: FilterValue<Provider>) => onChange('provider', value),
        [onChange],
    )

    const handleEnvironment = useCallback(
        (value: FilterValue<Environment>) => onChange('environment', value),
        [onChange],
    )

    const handleCriticality = useCallback(
        (value: FilterValue<Criticality>) => onChange('criticality', value),
        [onChange],
    )

    return (
        <div className="filter-bar">
            <div className="field field--search">
                <label className="field__label" htmlFor="resource-search">
                    Search
                </label>
                <input
                    className="field__control"
                    id="resource-search"
                    type="search"
                    placeholder="Search by resource name"
                    value={filters.search}
                    onChange={handleSearch}
                />
            </div>

            <FilterSelect
                id="provider-filter"
                label="Provider"
                allLabel="All providers"
                value={filters.provider}
                options={PROVIDERS}
                onChange={handleProvider}
            />

            <FilterSelect
                id="environment-filter"
                label="Environment"
                allLabel="All environments"
                value={filters.environment}
                options={ENVIRONMENTS}
                onChange={handleEnvironment}
            />

            <FilterSelect
                id="criticality-filter"
                label="Criticality"
                allLabel="All criticalities"
                value={filters.criticality}
                options={CRITICALITIES}
                onChange={handleCriticality}
            />

            <button className="button button--ghost" type="button" onClick={onReset} disabled={!hasActiveFilters}>
                Clear filters
            </button>
        </div>
    )
}
