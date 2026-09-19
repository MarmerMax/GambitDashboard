import Paper from "@mui/material/Paper"
import { DataGrid } from "@mui/x-data-grid"
import type { GridPaginationModel, GridRowParams } from "@mui/x-data-grid"
import { EmptyState } from "@src/components/common/EmptyState"
import type { Application } from "@src/types"
import { APPLICATION_COLUMNS } from "./applicationColumns"
import { ApplicationsToolbar } from "./ApplicationsToolbar"
import type { ApplicationsToolbarPropsType } from "./ApplicationsToolbar"

export interface ApplicationsGridPropsType {
    rows: Application[]
    rowCount: number
    isLoading: boolean
    paginationModel: GridPaginationModel
    toolbarProps: ApplicationsToolbarPropsType
    onPaginationModelChange: (model: GridPaginationModel) => void
    onRowClick: (params: GridRowParams<Application>) => void
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]
const ROW_HEIGHT = 52

const ApplicationsNoRows = () => (
    <EmptyState
        title="No applications yet"
        description="Select resources on the Resources page and click “Create Application” to group them."
    />
)

export const ApplicationsGrid = ({
    rows,
    rowCount,
    isLoading,
    paginationModel,
    toolbarProps,
    onPaginationModelChange,
    onRowClick,
}: ApplicationsGridPropsType) => (
    <Paper
        sx={{ display: "flex", flexDirection: "column", overflow: "hidden", flex: 1, minHeight: 0 }}
    >
        <ApplicationsToolbar {...toolbarProps} />
        <DataGrid
            rows={rows}
            columns={APPLICATION_COLUMNS}
            rowCount={rowCount}
            loading={isLoading}
            rowHeight={ROW_HEIGHT}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={onPaginationModelChange}
            onRowClick={onRowClick}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            disableColumnFilter
            disableColumnSelector
            slots={{ noRowsOverlay: ApplicationsNoRows }}
            slotProps={{
                loadingOverlay: { variant: "linear-progress", noRowsVariant: "skeleton" },
            }}
            sx={{
                border: 0,
                height: { xs: 560, lg: "100%" },
                "& .MuiDataGrid-row": { cursor: "pointer" },
            }}
        />
    </Paper>
)
