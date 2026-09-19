import Chip from "@mui/material/Chip"

export interface OpenIssuesPropsType {
    count: number
}

const HIGH_ISSUE_THRESHOLD = 5

const getColor = (count: number) => {
    if (count === 0) return "default"

    return count >= HIGH_ISSUE_THRESHOLD ? "error" : "warning"
}

export const OpenIssues = ({ count }: OpenIssuesPropsType) => (
    <Chip size="small" variant="outlined" color={getColor(count)} label={count} />
)
