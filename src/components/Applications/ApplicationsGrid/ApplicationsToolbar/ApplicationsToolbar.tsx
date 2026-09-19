import ClearIcon from "@mui/icons-material/Clear"
import SearchIcon from "@mui/icons-material/Search"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import InputAdornment from "@mui/material/InputAdornment"
import TextField from "@mui/material/TextField"
import type { ChangeEvent } from "react"
import { useCallback } from "react"

export type ApplicationsToolbarPropsType = {
    search: string
    onSearchChange: (value: string) => void
}

export const ApplicationsToolbar = ({ search, onSearchChange }: ApplicationsToolbarPropsType) => {
    const handleSearchChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => onSearchChange(event.target.value),
        [onSearchChange],
    )

    const handleClearSearch = useCallback(() => onSearchChange(""), [onSearchChange])

    return (
        <Box sx={{ borderBottom: 1, borderColor: "divider", p: 1.5 }}>
            <TextField
                size="small"
                label="Search applications"
                placeholder="Search by name"
                value={search}
                onChange={handleSearchChange}
                sx={{ width: "100%", maxWidth: 360 }}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                        ),
                        endAdornment: search ? (
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
        </Box>
    )
}
