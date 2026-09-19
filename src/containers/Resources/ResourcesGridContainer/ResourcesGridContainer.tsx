import { Alert, Button, Stack } from "@mui/material"
import type { GridRowSelectionModel } from "@mui/x-data-grid"
import { useCallback, useMemo } from "react"
import { ResourcesGrid } from "@src/components/Resources"
import { useResourcesTable } from "@src/hooks/Resources"

export interface ResourcesGridContainerPropsType {
    selectedIds: string[]
    onClearSelection: () => void
    onSelectedIdsChange: (ids: string[]) => void
    onCreateApplication: () => void
}

export const ResourcesGridContainer = ({
    selectedIds,
    onClearSelection,
    onCreateApplication,
    onSelectedIdsChange,
}: ResourcesGridContainerPropsType) => {
    const {
        rows,
        error,
        filters,
        rowCount,
        isLoading,
        sortModel,
        paginationModel,
        hasActiveFilters,
        retry,
        setSearch,
        setProvider,
        resetFilters,
        setEnvironment,
        setCriticality,
        handleSortModelChange,
        handlePaginationModelChange,
    } = useResourcesTable()

    const rowSelectionModel = useMemo<GridRowSelectionModel>(
        () => ({ type: "include", ids: new Set<string>(selectedIds) }),
        [selectedIds],
    )

    const handleRowSelectionModelChange = useCallback(
        (model: GridRowSelectionModel) => onSelectedIdsChange([...model.ids].map(String)),
        [onSelectedIdsChange],
    )

    const toolbarProps = useMemo(
        () => ({
            filters,
            hasActiveFilters,
            selectedCount: selectedIds.length,
            onResetFilters: resetFilters,
            onSearchChange: setSearch,
            onClearSelection,
            onCreateApplication,
            onProviderChange: setProvider,
            onEnvironmentChange: setEnvironment,
            onCriticalityChange: setCriticality,
        }),
        [
            filters,
            hasActiveFilters,
            selectedIds.length,
            setSearch,
            setProvider,
            setEnvironment,
            setCriticality,
            resetFilters,
            onClearSelection,
            onCreateApplication,
        ],
    )

    const noRowsProps = useMemo(
        () => ({ hasActiveFilters, onResetFilters: resetFilters }),
        [hasActiveFilters, resetFilters],
    )

    return (
        <Stack spacing={1.5} sx={{ flex: 1, minWidth: 0, minHeight: 0 }}>
            {error && (
                <Alert
                    severity="error"
                    action={
                        <Button color="inherit" size="small" onClick={retry}>
                            Retry
                        </Button>
                    }
                >
                    {error}
                </Alert>
            )}
            <ResourcesGrid
                rows={rows}
                rowCount={rowCount}
                isLoading={isLoading}
                paginationModel={paginationModel}
                sortModel={sortModel}
                rowSelectionModel={rowSelectionModel}
                toolbarProps={toolbarProps}
                noRowsProps={noRowsProps}
                onPaginationModelChange={handlePaginationModelChange}
                onSortModelChange={handleSortModelChange}
                onRowSelectionModelChange={handleRowSelectionModelChange}
            />
        </Stack>
    )
}
