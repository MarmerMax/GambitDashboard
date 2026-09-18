import type { Application, Resource } from '../types'
import { ApplicationCard } from './ApplicationCard'
import { EmptyState } from './EmptyState'

interface ApplicationsPanelProps {
    applications: Application[]
    resourcesById: Record<string, Resource>
    selectedApplicationId?: string
    onSelect: (id: string) => void
}

export const ApplicationsPanel = ({
    applications,
    resourcesById,
    selectedApplicationId,
    onSelect,
}: ApplicationsPanelProps) => (
    <section className="panel" aria-labelledby="applications-heading">
        <header className="panel__header">
            <div>
                <h2 className="panel__title" id="applications-heading">
                    Applications
                </h2>
                <p className="panel__subtitle">
                    {applications.length === 0
                        ? 'No applications yet'
                        : `${applications.length} application${applications.length === 1 ? '' : 's'}`}
                </p>
            </div>
        </header>

        {applications.length === 0 ? (
            <EmptyState
                title="No applications yet"
                description="Select resources in the table and click “Create Application” to group them."
            />
        ) : (
            <ul className="application-list">
                {applications.map((application) => (
                    <ApplicationCard
                        key={application.id}
                        application={application}
                        resources={application.resourceIds
                            .map((id) => resourcesById[id])
                            .filter((resource) => Boolean(resource))}
                        isSelected={application.id === selectedApplicationId}
                        onSelect={onSelect}
                    />
                ))}
            </ul>
        )}
    </section>
)
