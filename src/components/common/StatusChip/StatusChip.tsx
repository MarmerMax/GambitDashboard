import { Chip, alpha } from "@mui/material"

export interface StatusChipProps {
    label: string
    color: string
}

const BACKGROUND_OPACITY = 0.14

export const StatusChip = ({ label, color }: StatusChipProps) => (
    <Chip
        size="small"
        label={label}
        sx={{
            backgroundColor: alpha(color, BACKGROUND_OPACITY),
            color,
            textTransform: "capitalize",
        }}
    />
)
