import Box from "@mui/material/Box"
import List from "@mui/material/List"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { Application, Resource } from "@src/types"
import { EmptyState } from "@src/components/common/EmptyState"
import { ApplicationListItem } from "./ApplicationListItem"

export interface ApplicationsPanelItemType {
    application: Application
    resources: Resource[]
}

export interface ApplicationsPanelPropsType {
    items: ApplicationsPanelItemType[]
    selectedApplicationId: string | null
    onSelect: (id: string) => void
}

export const ApplicationsPanel = ({
    items,
    selectedApplicationId,
    onSelect,
}: ApplicationsPanelPropsType) => (
    <Paper
        sx={{
            p: 2,
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
        }}
    >
        <Stack sx={{ mb: 1.5, flexShrink: 0 }}>
            <Typography variant="h6">Applications</Typography>
            <Typography variant="body2" color="text.secondary">
                {items.length === 0
                    ? "No applications yet"
                    : `${items.length} application${items.length === 1 ? "" : "s"}`}
            </Typography>
        </Stack>

        <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
            {items.length === 0 ? (
                <EmptyState
                    title="No applications yet"
                    description="Select resources in the table and click “Create Application” to group them."
                />
            ) : (
                <List disablePadding>
                    {items.map(({ application, resources }) => (
                        <ApplicationListItem
                            key={application.id}
                            application={application}
                            resources={resources}
                            isSelected={application.id === selectedApplicationId}
                            onSelect={onSelect}
                        />
                    ))}
                </List>
            )}
        </Box>
    </Paper>
)
