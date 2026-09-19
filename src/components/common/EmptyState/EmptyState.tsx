import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { ReactNode } from "react"

export interface EmptyStatePropsType {
    title: string
    description: string
    action?: ReactNode
}

export const EmptyState = ({ title, description, action }: EmptyStatePropsType) => (
    <Stack
        spacing={1}
        sx={{
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            p: 4,
            textAlign: "center",
        }}
    >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 380 }}>
            {description}
        </Typography>
        {action}
    </Stack>
)
