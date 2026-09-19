import ClearIcon from "@mui/icons-material/Clear"
import SearchIcon from "@mui/icons-material/Search"
import {
    Box,
    Button,
    Divider,
    IconButton,
    InputAdornment,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material"
import type { ChangeEvent } from "react"
import { useCallback } from "react"
import { CRITICALITIES, ENVIRONMENTS, PROVIDERS } from "@src/types"
import type { Criticality, Environment, Provider, ResourceFilters } from "@src/types"

export type ResourcesToolbarPropsType = {
    filters: ResourceFilters
    hasActiveFilters: boolean
    selectedCount: number
    onSearchChange: (value: string) => void
    onProviderChange: (value?: Provider) => void
    onEnvironmentChange: (value?: Environment) => void
    onCriticalityChange: (value?: Criticality) => void
    onResetFilters: () => void
    onClearSelection: () => void
    onCreateApplication: () => void
}

const ALL_OPTION_VALUE = ""
const SELECT_WIDTH = 170

export const ResourcesToolbar = ({
    filters,
    hasActiveFilters,
    selectedCount,
    onSearchChange,
    onProviderChange,
    onEnvironmentChange,
    onCriticalityChange,
    onResetFilters,
    onClearSelection,
    onCreateApplication,
}: ResourcesToolbarPropsType) => {
    const hasSelection = selectedCount > 0

    const handleSearchChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => onSearchChange(event.target.value),
        [onSearchChange],
    )

    const handleClearSearch = useCallback(() => onSearchChange(""), [onSearchChange])

    const handleProviderChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) =>
            onProviderChange(PROVIDERS.find((provider) => provider === event.target.value)),
        [onProviderChange],
    )

    const handleEnvironmentChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) =>
            onEnvironmentChange(
                ENVIRONMENTS.find((environment) => environment === event.target.value),
            ),
        [onEnvironmentChange],
    )

    const handleCriticalityChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) =>
            onCriticalityChange(
                CRITICALITIES.find((criticality) => criticality === event.target.value),
            ),
        [onCriticalityChange],
    )

    return (
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Stack
                direction={{ xs: "column", lg: "row" }}
                spacing={1.5}
                sx={{ p: 1.5, alignItems: { lg: "center" } }}
            >
                <TextField
                    size="small"
                    label="Search resources"
                    placeholder="Search by name"
                    value={filters.search}
                    onChange={handleSearchChange}
                    sx={{ flex: 1, minWidth: 220 }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                            endAdornment: filters.search ? (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        aria-label="Clear search"
                                        onClick={handleClearSearch}
                                    >
                                        <ClearIcon fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            ) : undefined,
                        },
                    }}
                />

                <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: "wrap" }}>
                    <TextField
                        select
                        size="small"
                        label="Provider"
                        value={filters.provider ?? ALL_OPTION_VALUE}
                        onChange={handleProviderChange}
                        sx={{ width: SELECT_WIDTH }}
                    >
                        <MenuItem value={ALL_OPTION_VALUE}>All providers</MenuItem>
                        {PROVIDERS.map((provider) => (
                            <MenuItem key={provider} value={provider}>
                                {provider}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        size="small"
                        label="Environment"
                        value={filters.environment ?? ALL_OPTION_VALUE}
                        onChange={handleEnvironmentChange}
                        sx={{ width: SELECT_WIDTH, textTransform: "capitalize" }}
                    >
                        <MenuItem value={ALL_OPTION_VALUE}>All environments</MenuItem>
                        {ENVIRONMENTS.map((environment) => (
                            <MenuItem
                                key={environment}
                                value={environment}
                                sx={{ textTransform: "capitalize" }}
                            >
                                {environment}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        size="small"
                        label="Criticality"
                        value={filters.criticality ?? ALL_OPTION_VALUE}
                        onChange={handleCriticalityChange}
                        sx={{ width: SELECT_WIDTH, textTransform: "capitalize" }}
                    >
                        <MenuItem value={ALL_OPTION_VALUE}>All criticalities</MenuItem>
                        {CRITICALITIES.map((criticality) => (
                            <MenuItem
                                key={criticality}
                                value={criticality}
                                sx={{ textTransform: "capitalize" }}
                            >
                                {criticality}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Button
                        variant="outlined"
                        onClick={onResetFilters}
                        disabled={!hasActiveFilters}
                    >
                        Clear filters
                    </Button>
                </Stack>
            </Stack>

            <Divider />
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{
                    px: 1.5,
                    py: 1,
                    alignItems: { sm: "center" },
                    justifyContent: "space-between",
                    backgroundColor: hasSelection ? "action.hover" : "transparent",
                }}
            >
                <Typography
                    variant="body2"
                    color={hasSelection ? "text.primary" : "text.secondary"}
                    sx={{ fontWeight: 600 }}
                >
                    {hasSelection
                        ? `${selectedCount} resource${selectedCount === 1 ? "" : "s"} selected`
                        : "Select resources to create an application"}
                </Typography>
                <Stack direction="row" spacing={1}>
                    <Button size="small" onClick={onClearSelection} disabled={!hasSelection}>
                        Clear selection
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        onClick={onCreateApplication}
                        disabled={!hasSelection}
                    >
                        Create Application ({selectedCount})
                    </Button>
                </Stack>
            </Stack>
        </Box>
    )
}
