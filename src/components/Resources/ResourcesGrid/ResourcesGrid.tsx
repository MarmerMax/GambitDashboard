import Paper from "@mui/material/Paper"
import { DataGrid } from "@mui/x-data-grid"
import type { GridPaginationModel, GridRowSelectionModel, GridSortModel } from "@mui/x-data-grid"
import type { Resource } from "@src/types"
import { RESOURCE_COLUMNS } from "./resourceColumns"
import { ResourcesNoRows } from "./ResourcesNoRows"
import type { ResourcesNoRowsPropsType } from "./ResourcesNoRows"
import { ResourcesToolbar } from "./ResourcesToolbar"
import type { ResourcesToolbarPropsType } from "./ResourcesToolbar"

export interface ResourcesGridPropsType {
    rows: Resource[]
    rowCount: number
    isLoading: boolean
    paginationModel: GridPaginationModel
    sortModel: GridSortModel
    rowSelectionModel: GridRowSelectionModel
    toolbarProps: ResourcesToolbarPropsType
    noRowsProps: ResourcesNoRowsPropsType
    onPaginationModelChange: (model: GridPaginationModel) => void
    onSortModelChange: (model: GridSortModel) => void
    onRowSelectionModelChange: (model: GridRowSelectionModel) => void
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]
const ROW_HEIGHT = 58

export const ResourcesGrid = ({
    rows,
    rowCount,
    isLoading,
    paginationModel,
    sortModel,
    rowSelectionModel,
    toolbarProps,
    noRowsProps,
    onPaginationModelChange,
    onSortModelChange,
    onRowSelectionModelChange,
}: ResourcesGridPropsType) => (
    <Paper
        sx={{ display: "flex", flexDirection: "column", overflow: "hidden", flex: 1, minHeight: 0 }}
    >
        <DataGrid
            rows={rows}
            columns={RESOURCE_COLUMNS}
            rowCount={rowCount}
            loading={isLoading}
            rowHeight={ROW_HEIGHT}
            paginationMode="server"
            sortingMode="server"
            filterMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={onPaginationModelChange}
            sortModel={sortModel}
            onSortModelChange={onSortModelChange}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            checkboxSelection
            disableRowSelectionOnClick
            disableRowSelectionExcludeModel
            keepNonExistentRowsSelected
            rowSelectionModel={rowSelectionModel}
            onRowSelectionModelChange={onRowSelectionModelChange}
            disableColumnFilter
            disableColumnSelector
            showToolbar
            slots={{ toolbar: ResourcesToolbar, noRowsOverlay: ResourcesNoRows }}
            slotProps={{
                toolbar: toolbarProps,
                noRowsOverlay: noRowsProps,
                loadingOverlay: { variant: "linear-progress", noRowsVariant: "skeleton" },
            }}
            sx={{ border: 0, height: { xs: 560, lg: "100%" } }}
        />
    </Paper>
)
