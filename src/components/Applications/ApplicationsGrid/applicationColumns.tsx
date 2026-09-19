import Chip from "@mui/material/Chip"
import Typography from "@mui/material/Typography"
import type { GridColDef } from "@mui/x-data-grid"
import type { Application } from "@src/types"

const COLUMNS: GridColDef<Application>[] = [
    {
        field: "name",
        headerName: "Name",
        renderCell: ({ row }) => (
            <Typography variant="body2" noWrap sx={{ fontWeight: "bold", lineHeight: "52px" }}>
                {row.name}
            </Typography>
        ),
    },
    {
        field: "description",
        headerName: "Description",
        flex: 2,
        renderCell: ({ row }) => (
            <Typography variant="body2" color="text.secondary" noWrap sx={{ lineHeight: "52px" }}>
                {row.description ?? "—"}
            </Typography>
        ),
    },
    {
        field: "resourceIds",
        headerName: "Resources",
        renderCell: ({ row }) => (
            <Chip size="small" variant="outlined" label={row.resourceIds.length} />
        ),
    },
]

export const APPLICATION_COLUMNS: GridColDef<Application>[] = COLUMNS.map((column) => ({
    flex: 1,
    sortable: false,
    disableColumnMenu: true,
    ...column,
}))
