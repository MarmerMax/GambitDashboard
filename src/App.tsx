import { useCallback, useMemo, useState } from 'react'
import { ApplicationDetails } from './components/ApplicationDetails'
import { ApplicationsPanel } from './components/ApplicationsPanel'
import { CreateApplicationModal } from './components/CreateApplicationModal'
import { ResourcesPanel } from './components/ResourcesPanel'
import { useApplications } from './hooks/useApplications'
import { useResourceFilters } from './hooks/useResourceFilters'
import { useResources } from './hooks/useResources'
import { useSelection } from './hooks/useSelection'
import type { Resource } from './types'

export const App = () => {
    const { resources, isLoading } = useResources()
    const { filters, setFilter, resetFilters, filteredResources, hasActiveFilters } = useResourceFilters(resources)
    const { selectedIds, toggle, toggleMany, clear } = useSelection()
    const { applications, createApplication } = useApplications()

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedApplicationId, setSelectedApplicationId] = useState<string>()

    const resourcesById = useMemo(
        () => Object.fromEntries(resources.map((resource) => [resource.id, resource])) as Record<string, Resource>,
        [resources],
    )

    const selectedResources = useMemo(
        () => resources.filter((resource) => selectedIds.includes(resource.id)),
        [resources, selectedIds],
    )

    const selectedApplication = useMemo(
        () => applications.find((application) => application.id === selectedApplicationId),
        [applications, selectedApplicationId],
    )

    const applicationResources = useMemo(
        () =>
            (selectedApplication?.resourceIds ?? [])
                .map((id) => resourcesById[id])
                .filter((resource) => Boolean(resource)),
        [selectedApplication, resourcesById],
    )

    const openIssuesTotal = useMemo(
        () => resources.reduce((total, resource) => total + resource.openIssues, 0),
        [resources],
    )

    const handleOpenModal = useCallback(() => setIsModalOpen(true), [])

    const handleCancelModal = useCallback(() => setIsModalOpen(false), [])

    const handleCreateApplication = useCallback(
        (name: string, description: string) => {
            const application = createApplication({ name, description, resourceIds: selectedIds })

            setSelectedApplicationId(application.id)
            setIsModalOpen(false)
            clear()
        },
        [createApplication, selectedIds, clear],
    )

    const handleSelectApplication = useCallback((id: string) => setSelectedApplicationId(id), [])

    return (
        <div className="app">
            <header className="app__header">
                <div className="brand">
                    <span className="brand__mark" aria-hidden="true">
                        G
                    </span>
                    <div>
                        <p className="brand__name">Gambit Security</p>
                        <p className="brand__subtitle">Cloud resource explorer</p>
                    </div>
                </div>
                <dl className="stats">
                    <div className="stat">
                        <dt className="stat__label">Resources</dt>
                        <dd className="stat__value">{resources.length}</dd>
                    </div>
                    <div className="stat">
                        <dt className="stat__label">Open issues</dt>
                        <dd className="stat__value">{openIssuesTotal}</dd>
                    </div>
                    <div className="stat">
                        <dt className="stat__label">Applications</dt>
                        <dd className="stat__value">{applications.length}</dd>
                    </div>
                </dl>
            </header>

            <main className="app__main">
                <div className="layout">
                    <ResourcesPanel
                        resources={filteredResources}
                        totalCount={resources.length}
                        isLoading={isLoading}
                        filters={filters}
                        hasActiveFilters={hasActiveFilters}
                        onFilterChange={setFilter}
                        onResetFilters={resetFilters}
                        selectedIds={selectedIds}
                        onToggle={toggle}
                        onToggleAll={toggleMany}
                        onClearSelection={clear}
                        onCreateApplication={handleOpenModal}
                    />
                    <ApplicationsPanel
                        applications={applications}
                        resourcesById={resourcesById}
                        selectedApplicationId={selectedApplicationId}
                        onSelect={handleSelectApplication}
                    />
                </div>

                <ApplicationDetails application={selectedApplication} resources={applicationResources} />
            </main>

            {isModalOpen && (
                <CreateApplicationModal
                    selectedResources={selectedResources}
                    onCancel={handleCancelModal}
                    onCreate={handleCreateApplication}
                />
            )}
        </div>
    )
}
