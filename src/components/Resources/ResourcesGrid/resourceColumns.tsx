import { Stack, Typography } from "@mui/material"
import type { GridColDef } from "@mui/x-data-grid"
import type { Resource } from "@src/types"
import { CriticalityChip } from "../CriticalityChip"
import { EnvironmentChip } from "../EnvironmentChip"
import { OpenIssues } from "../OpenIssues"
import { ProviderChip } from "../ProviderChip"

const COLUMNS: GridColDef<Resource>[] = [
    {
        field: "name",
        headerName: "Name",
        renderCell: ({ row }) => (
            <Stack sx={{ justifyContent: "center", height: "100%" }}>
                <Typography variant="body2" noWrap sx={{ fontWeight: "bold" }}>
                    {row.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                    {row.region} · {row.owner}
                </Typography>
            </Stack>
        ),
    },
    {
        field: "type",
        headerName: "Type",
    },
    {
        field: "provider",
        headerName: "Provider",
        renderCell: ({ row }) => <ProviderChip provider={row.provider} />,
    },
    {
        field: "environment",
        headerName: "Environment",
        renderCell: ({ row }) => <EnvironmentChip environment={row.environment} />,
    },
    {
        field: "criticality",
        headerName: "Criticality",
        renderCell: ({ row }) => <CriticalityChip criticality={row.criticality} />,
    },
    {
        field: "openIssues",
        headerName: "Open issues",
        renderCell: ({ row }) => <OpenIssues count={row.openIssues} />,
    },
]

export const RESOURCE_COLUMNS: GridColDef<Resource>[] = COLUMNS.map((column) => ({
    ...column,
    flex: 1,
    disableColumnMenu: true,
}))
