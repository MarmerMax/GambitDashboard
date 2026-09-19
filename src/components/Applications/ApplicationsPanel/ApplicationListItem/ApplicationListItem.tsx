import Chip from "@mui/material/Chip"
import ListItemButton from "@mui/material/ListItemButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useCallback } from "react"
import type { Application, Resource } from "@src/types"

export interface ApplicationListItemPropsType {
    application: Application
    resources: Resource[]
    isSelected: boolean
    onSelect: (id: string) => void
}

const MAX_VISIBLE_RESOURCES = 3

export const ApplicationListItem = ({
    application,
    resources,
    isSelected,
    onSelect,
}: ApplicationListItemPropsType) => {
    const handleSelect = useCallback(() => onSelect(application.id), [onSelect, application.id])

    const visibleResources = resources.slice(0, MAX_VISIBLE_RESOURCES)
    const hiddenCount = resources.length - visibleResources.length

    return (
        <ListItemButton
            selected={isSelected}
            onClick={handleSelect}
            sx={{ display: "block", border: 1, borderColor: "divider", borderRadius: 1, mb: 1 }}
        >
            <Stack
                direction="row"
                spacing={1}
                sx={{ justifyContent: "space-between", alignItems: "baseline" }}
            >
                <Typography variant="subtitle2" noWrap>
                    {application.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                    {resources.length} resource{resources.length === 1 ? "" : "s"}
                </Typography>
            </Stack>

            {application.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {application.description}
                </Typography>
            )}

            <Stack direction="row" spacing={0.5} useFlexGap sx={{ flexWrap: "wrap", mt: 1 }}>
                {visibleResources.map((resource) => (
                    <Chip key={resource.id} size="small" variant="outlined" label={resource.name} />
                ))}
                {hiddenCount > 0 && (
                    <Chip size="small" variant="outlined" label={`+${hiddenCount} more`} />
                )}
            </Stack>
        </ListItemButton>
    )
}
