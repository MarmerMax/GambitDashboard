import { useCallback } from 'react'
import type { Resource } from '../types'
import { Badge } from './Badge'
import { IssueCount } from './IssueCount'

interface ResourceRowProps {
    resource: Resource
    isSelected: boolean
    onToggle: (id: string) => void
}

export const ResourceRow = ({ resource, isSelected, onToggle }: ResourceRowProps) => {
    const handleToggle = useCallback(() => onToggle(resource.id), [onToggle, resource.id])

    return (
        <tr className={isSelected ? 'resource-row resource-row--selected' : 'resource-row'}>
            <td className="cell cell--checkbox">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={handleToggle}
                    aria-label={`Select ${resource.name}`}
                />
            </td>
            <td className="cell">
                <span className="resource-name">{resource.name}</span>
                <span className="resource-meta">
                    {resource.region} · {resource.owner}
                </span>
                <span className="tags">
                    {resource.tags.map((tag) => (
                        <span className="tag" key={tag}>
                            {tag}
                        </span>
                    ))}
                </span>
            </td>
            <td className="cell cell--muted">{resource.type}</td>
            <td className="cell">
                <Badge tone={resource.provider} />
            </td>
            <td className="cell">
                <Badge tone={resource.environment} />
            </td>
            <td className="cell">
                <Badge tone={resource.criticality} />
            </td>
            <td className="cell cell--numeric">
                <IssueCount count={resource.openIssues} />
            </td>
        </tr>
    )
}
