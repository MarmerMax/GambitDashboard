import { useCallback, useState } from "react"
import { ApplicationCreatedSnackbar } from "@src/components/Applications"
import { CreateApplicationDialogContainer } from "@src/containers/Applications"
import { ResourcesGridContainer } from "@src/containers/Resources"
import { useResourceSelection } from "@src/hooks/Resources"
import { useGetResourcesByIdsQuery } from "@src/state/Resources"
import type { Application, Resource } from "@src/types"

const EMPTY_RESOURCES: Resource[] = []

export const ResourcesPage = () => {
    const { selectedIds, onSetSelectedIds, onClearSelectedIds } = useResourceSelection()

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [createdApplication, setCreatedApplication] = useState<Application>()

    const { data: selectedResources = EMPTY_RESOURCES } = useGetResourcesByIdsQuery(selectedIds, {
        skip: !isCreateDialogOpen || selectedIds.length === 0,
    })

    const handleOpenCreateDialog = useCallback(() => setIsCreateDialogOpen(true), [])

    const handleCloseCreateDialog = useCallback(() => setIsCreateDialogOpen(false), [])

    const handleApplicationCreated = useCallback(
        (application: Application) => {
            onClearSelectedIds()
            setIsCreateDialogOpen(false)
            setCreatedApplication(application)
        },
        [onClearSelectedIds],
    )

    const handleCloseSnackbar = useCallback(() => setCreatedApplication(undefined), [])

    return (
        <>
            <ResourcesGridContainer
                selectedIds={selectedIds}
                onSelectedIdsChange={onSetSelectedIds}
                onClearSelection={onClearSelectedIds}
                onCreateApplication={handleOpenCreateDialog}
            />

            <CreateApplicationDialogContainer
                open={isCreateDialogOpen}
                selectedResources={selectedResources}
                onCancel={handleCloseCreateDialog}
                onCreated={handleApplicationCreated}
            />

            <ApplicationCreatedSnackbar
                application={createdApplication}
                onClose={handleCloseSnackbar}
            />
        </>
    )
}
