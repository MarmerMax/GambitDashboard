import { useCallback, useMemo, useState } from "react"
import { ApplicationCreatedSnackbar } from "@src/components/Applications/ApplicationCreatedSnackbar"
import { CreateApplicationDialogContainer } from "@src/containers/Applications/CreateApplicationDialogContainer"
import { ResourcesGridContainer } from "@src/containers/Resources/ResourcesGridContainer"
import { useResourceSelection } from "@src/hooks/Resources/useResourceSelection"
import { useAppSelector } from "@src/state/hooks"
import type { Application, Resource } from "@src/types"

export const ResourcesPage = () => {
    const { selectedIds, onSetSelectedIds, onClearSelectedIds } = useResourceSelection()
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [createdApplication, setCreatedApplication] = useState<Application>()

    const entities = useAppSelector((store) => store.resources.entities)

    const selectedResources = useMemo(
        () =>
            selectedIds
                .map((id) => entities[id])
                .filter((resource): resource is Resource => Boolean(resource)),
        [selectedIds, entities],
    )

    const handleOpenCreateDialog = useCallback(() => setIsCreateDialogOpen(true), [])

    const handleCloseCreateDialog = useCallback(() => setIsCreateDialogOpen(false), [])

    const handleCreated = useCallback(
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
                onCreated={handleCreated}
            />

            <ApplicationCreatedSnackbar
                application={createdApplication}
                onClose={handleCloseSnackbar}
            />
        </>
    )
}
