import Alert from "@mui/material/Alert"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import type { GridRowParams } from "@mui/x-data-grid"
import { useCallback, useMemo } from "react"
import { useNavigate } from "react-router"
import { ApplicationsGrid } from "@src/components/Applications/ApplicationsGrid"
import { useApplicationsTable } from "@src/hooks/Applications/useApplicationsTable"
import { APP_ROUTES } from "@src/types"
import type { Application } from "@src/types"

export const ApplicationsGridContainer = () => {
    const navigate = useNavigate()
    const {
        rows,
        rowCount,
        isLoading,
        error,
        search,
        paginationModel,
        setSearch,
        handlePaginationModelChange,
        retry,
    } = useApplicationsTable()

    const handleRowClick = useCallback(
        ({ row }: GridRowParams<Application>) => navigate(`${APP_ROUTES.APPLICATIONS}/${row.id}`),
        [navigate],
    )

    const toolbarProps = useMemo(() => ({ search, onSearchChange: setSearch }), [search, setSearch])

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
            <ApplicationsGrid
                rows={rows}
                rowCount={rowCount}
                isLoading={isLoading}
                paginationModel={paginationModel}
                toolbarProps={toolbarProps}
                onPaginationModelChange={handlePaginationModelChange}
                onRowClick={handleRowClick}
            />
        </Stack>
    )
}
