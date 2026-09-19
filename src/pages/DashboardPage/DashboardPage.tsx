import { Container, Grid, Stack } from "@mui/material"
import { useCallback, useMemo, useState } from "react"
import { AppHeader } from "@src/components/common/AppHeader"
import { ApplicationDetailsDialogContainer } from "@src/containers/Applications/ApplicationDetailsDialogContainer"
import { ApplicationsPanelContainer } from "@src/containers/Applications/ApplicationsPanelContainer"
import { CreateApplicationDialogContainer } from "@src/containers/Applications/CreateApplicationDialogContainer"
import { ResourcesGridContainer } from "@src/containers/Resources/ResourcesGridContainer"
import { useApplications } from "@src/hooks/Applications/useApplications"
import { useResourceCache } from "@src/hooks/Resources/useResourceCache"
import { useResourceSelection } from "@src/hooks/Resources/useResourceSelection"

export const DashboardPage = () => {
    const { registerResources, getResources } = useResourceCache()
    const {
        selectedIds: selectedResourceIds,
        onSetSelectedIds: onSetSelectedResourceIds,
        onClearSelectedIds: onClearResourceSelection,
    } = useResourceSelection()

    const { applications, selectedApplicationId, setSelectedApplicationId, createApplication } =
        useApplications()

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

    const selectedResources = useMemo(
        () => getResources(selectedResourceIds),
        [getResources, selectedResourceIds],
    )

    const selectedApplication = useMemo(
        () => applications.find((application) => application.id === selectedApplicationId),
        [applications, selectedApplicationId],
    )

    const handleOpenCreateDialog = useCallback(() => setIsCreateDialogOpen(true), [])

    const handleCloseCreateDialog = useCallback(() => setIsCreateDialogOpen(false), [])

    const handleCreateApplication = useCallback(
        (name: string, description: string) => {
            createApplication({ name, description, resourceIds: selectedResourceIds })
            onClearResourceSelection()
            setIsCreateDialogOpen(false)
        },
        [createApplication, selectedResourceIds, onClearResourceSelection],
    )

    const handleSelectApplication = useCallback(
        (id: string) => setSelectedApplicationId(id),
        [setSelectedApplicationId],
    )

    const handleCloseDetailsDialog = useCallback(
        () => setSelectedApplicationId(null),
        [setSelectedApplicationId],
    )

    return (
        <Stack sx={{ height: { lg: "100vh" } }}>
            <AppHeader />

            <Container maxWidth="xl" sx={{ py: 3, display: "flex", flex: { lg: 1 }, minHeight: 0 }}>
                <Grid
                    container
                    spacing={2}
                    sx={{ flex: 1, minHeight: 0, flexWrap: { lg: "nowrap" } }}
                >
                    <Grid size={{ xs: 12, lg: 8 }} sx={{ display: "flex", minHeight: 0 }}>
                        <ResourcesGridContainer
                            selectedIds={selectedResourceIds}
                            onClearSelection={onClearResourceSelection}
                            onResourcesLoaded={registerResources}
                            onSelectedIdsChange={onSetSelectedResourceIds}
                            onCreateApplication={handleOpenCreateDialog}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, lg: 4 }} sx={{ display: "flex", minHeight: 0 }}>
                        <ApplicationsPanelContainer
                            applications={applications}
                            selectedApplicationId={selectedApplicationId}
                            getResources={getResources}
                            onSelect={handleSelectApplication}
                        />
                    </Grid>
                </Grid>
            </Container>

            <CreateApplicationDialogContainer
                open={isCreateDialogOpen}
                selectedResources={selectedResources}
                onCancel={handleCloseCreateDialog}
                onCreate={handleCreateApplication}
            />

            <ApplicationDetailsDialogContainer
                onClose={handleCloseDetailsDialog}
                application={selectedApplication}
                getResources={getResources}
            />
        </Stack>
    )
}
