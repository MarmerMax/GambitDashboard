import FullscreenIcon from "@mui/icons-material/Fullscreen"
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit"
import IconButton from "@mui/material/IconButton"
import type { IconButtonProps } from "@mui/material/IconButton"

export type FullScreenIconButtonPropsType = IconButtonProps & {
    isFullScreen?: boolean
}

export const FullScreenIconButton = ({
    isFullScreen = false,
    ...props
}: FullScreenIconButtonPropsType) => {
    const Icon = isFullScreen ? FullscreenExitIcon : FullscreenIcon

    return (
        <IconButton
            aria-label={isFullScreen ? "Exit full screen" : "Expand to full screen"}
            {...props}
        >
            <Icon />
        </IconButton>
    )
}
