import { useCallback } from 'react'
import type { ChangeEvent } from 'react'
import type { Resource } from '../types'
import { ResourceRow } from './ResourceRow'

interface ResourceTableProps {
    resources: Resource[]
    selectedIds: string[]
    onToggle: (id: string) => void
    onToggleAll: (ids: string[], shouldSelect: boolean) => void
}

export const ResourceTable = ({ resources, selectedIds, onToggle, onToggleAll }: ResourceTableProps) => {
    const visibleIds = resources.map((resource) => resource.id)
    const selectedVisibleCount = visibleIds.filter((id) => selectedIds.includes(id)).length
    const areAllSelected = selectedVisibleCount === visibleIds.length
    const areSomeSelected = selectedVisibleCount > 0 && !areAllSelected

    const handleToggleAll = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => onToggleAll(visibleIds, event.target.checked),
        [onToggleAll, visibleIds],
    )

    const selectAllRef = useCallback(
        (element: HTMLInputElement | null) => {
            if (element) element.indeterminate = areSomeSelected
        },
        [areSomeSelected],
    )

    return (
        <div className="table-scroll">
            <table className="table">
                <thead>
                    <tr>
                        <th className="cell--checkbox" scope="col">
                            <input
                                ref={selectAllRef}
                                type="checkbox"
                                checked={areAllSelected}
                                onChange={handleToggleAll}
                                aria-label="Select all visible resources"
                            />
                        </th>
                        <th scope="col">Name</th>
                        <th scope="col">Type</th>
                        <th scope="col">Provider</th>
                        <th scope="col">Environment</th>
                        <th scope="col">Criticality</th>
                        <th className="cell--numeric" scope="col">
                            Open issues
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {resources.map((resource) => (
                        <ResourceRow
                            key={resource.id}
                            resource={resource}
                            isSelected={selectedIds.includes(resource.id)}
                            onToggle={onToggle}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    )
}
