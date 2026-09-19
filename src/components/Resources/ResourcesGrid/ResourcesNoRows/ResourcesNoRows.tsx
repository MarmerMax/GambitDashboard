import Button from "@mui/material/Button"
import { EmptyState } from "@src/components/common/EmptyState"

export type ResourcesNoRowsPropsType = {
    hasActiveFilters: boolean
    onResetFilters: () => void
}

export const ResourcesNoRows = ({ hasActiveFilters, onResetFilters }: ResourcesNoRowsPropsType) =>
    hasActiveFilters ? (
        <EmptyState
            title="No resources match your filters"
            description="Try a different search term, or clear the filters to see the full inventory."
            action={
                <Button variant="outlined" size="small" onClick={onResetFilters}>
                    Clear filters
                </Button>
            }
        />
    ) : (
        <EmptyState title="No resources" description="The inventory returned no resources." />
    )
