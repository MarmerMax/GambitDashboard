import type { ResourcesNoRowsPropsType } from "@src/components/Resources/ResourcesGrid/ResourcesNoRows"
import type { ResourcesToolbarPropsType } from "@src/components/Resources/ResourcesGrid/ResourcesToolbar"

declare module "@mui/x-data-grid" {
    interface ToolbarPropsOverrides extends ResourcesToolbarPropsType {}

    interface NoRowsOverlayPropsOverrides extends ResourcesNoRowsPropsType {}
}
