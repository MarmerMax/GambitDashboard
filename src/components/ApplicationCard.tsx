import { useCallback } from 'react'
import type { Application, Resource } from '../types'

interface ApplicationCardProps {
    application: Application
    resources: Resource[]
    isSelected: boolean
    onSelect: (id: string) => void
}

const MAX_VISIBLE_RESOURCES = 3

export const ApplicationCard = ({ application, resources, isSelected, onSelect }: ApplicationCardProps) => {
    const handleSelect = useCallback(() => onSelect(application.id), [onSelect, application.id])

    const visibleResources = resources.slice(0, MAX_VISIBLE_RESOURCES)
    const hiddenCount = resources.length - visibleResources.length

    return (
        <li>
            <button
                className={isSelected ? 'application-card application-card--selected' : 'application-card'}
                type="button"
                onClick={handleSelect}
                aria-pressed={isSelected}
            >
                <span className="application-card__header">
                    <span className="application-card__name">{application.name}</span>
                    <span className="application-card__count">
                        {resources.length} resource{resources.length === 1 ? '' : 's'}
                    </span>
                </span>
                {application.description && (
                    <span className="application-card__description">{application.description}</span>
                )}
                <span className="tags">
                    {visibleResources.map((resource) => (
                        <span className="tag" key={resource.id}>
                            {resource.name}
                        </span>
                    ))}
                    {hiddenCount > 0 && <span className="tag tag--more">+{hiddenCount} more</span>}
                </span>
            </button>
        </li>
    )
}
