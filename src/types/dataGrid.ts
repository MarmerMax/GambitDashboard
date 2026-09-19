import type { ResourcesNoRowsPropsType } from "@src/components/Resources"
import type { ResourcesToolbarPropsType } from "@src/components/Resources"

declare module "@mui/x-data-grid" {
    interface ToolbarPropsOverrides extends ResourcesToolbarPropsType {}

    interface NoRowsOverlayPropsOverrides extends ResourcesNoRowsPropsType {}
}
