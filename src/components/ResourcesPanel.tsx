import type { Resource, ResourceFilters } from '../types'
import { EmptyState } from './EmptyState'
import { FilterBar } from './FilterBar'
import { ResourceTable } from './ResourceTable'

interface ResourcesPanelProps {
    resources: Resource[]
    totalCount: number
    isLoading: boolean
    filters: ResourceFilters
    hasActiveFilters: boolean
    onFilterChange: <Key extends keyof ResourceFilters>(key: Key, value: ResourceFilters[Key]) => void
    onResetFilters: () => void
    selectedIds: string[]
    onToggle: (id: string) => void
    onToggleAll: (ids: string[], shouldSelect: boolean) => void
    onClearSelection: () => void
    onCreateApplication: () => void
}

const SKELETON_ROWS = [0, 1, 2, 3, 4]

export const ResourcesPanel = ({
    resources,
    totalCount,
    isLoading,
    filters,
    hasActiveFilters,
    onFilterChange,
    onResetFilters,
    selectedIds,
    onToggle,
    onToggleAll,
    onClearSelection,
    onCreateApplication,
}: ResourcesPanelProps) => {
    const selectedCount = selectedIds.length
    const isEmpty = !isLoading && resources.length === 0

    return (
        <section className="panel" aria-labelledby="resources-heading">
            <header className="panel__header">
                <div>
                    <h2 className="panel__title" id="resources-heading">
                        Resources
                    </h2>
                    <p className="panel__subtitle">
                        {isLoading ? 'Loading inventory…' : `Showing ${resources.length} of ${totalCount} resources`}
                    </p>
                </div>
            </header>

            <FilterBar
                filters={filters}
                onChange={onFilterChange}
                onReset={onResetFilters}
                hasActiveFilters={hasActiveFilters}
            />

            {isLoading && (
                <div className="skeleton-list" aria-hidden="true">
                    {SKELETON_ROWS.map((row) => (
                        <div className="skeleton-row" key={row} />
                    ))}
                </div>
            )}

            {isEmpty && (
                <EmptyState
                    title="No resources match your filters"
                    description="Try a different search term, or clear the filters to see the full inventory."
                    action={
                        <button className="button button--secondary" type="button" onClick={onResetFilters}>
                            Clear filters
                        </button>
                    }
                />
            )}

            {!isLoading && resources.length > 0 && (
                <ResourceTable
                    resources={resources}
                    selectedIds={selectedIds}
                    onToggle={onToggle}
                    onToggleAll={onToggleAll}
                />
            )}

            {selectedCount > 0 && (
                <div className="selection-bar">
                    <span className="selection-bar__count">
                        {selectedCount} resource{selectedCount === 1 ? '' : 's'} selected
                    </span>
                    <div className="selection-bar__actions">
                        <button className="button button--ghost" type="button" onClick={onClearSelection}>
                            Clear selection
                        </button>
                        <button className="button button--primary" type="button" onClick={onCreateApplication}>
                            Create Application ({selectedCount})
                        </button>
                    </div>
                </div>
            )}
        </section>
    )
}
