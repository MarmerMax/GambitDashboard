import CloseIcon from "@mui/icons-material/Close"
import { Dialog as MuiDialog, DialogTitle, IconButton, Stack, Typography } from "@mui/material"
import type { DialogProps } from "@mui/material"
import type { ReactNode } from "react"
import { FullScreenIconButton } from "./FullScreenIconButton"

export type DialogPropsType = Omit<DialogProps, "title" | "onClose"> & {
    title?: ReactNode
    subtitle?: ReactNode
    action?: ReactNode
    showCloseButton?: boolean
    showFullScreenButton?: boolean
    onToggleFullScreen?: () => void
    onClose: () => void
}

export const Dialog = ({
    title,
    subtitle,
    action,
    children,
    fullScreen,
    onToggleFullScreen,
    onClose,
    showCloseButton = true,
    showFullScreenButton = false,
    ...props
}: DialogPropsType) => {
    const hasAction = Boolean(action) || showCloseButton || showFullScreenButton
    const showTitle = Boolean(title) || hasAction

    return (
        <MuiDialog fullScreen={fullScreen} onClose={onClose} {...props}>
            {showTitle && (
                <DialogTitle component="div">
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{ alignItems: "center", justifyContent: "space-between" }}
                    >
                        <Stack sx={{ minWidth: 0 }}>
                            <Typography variant="h6" noWrap>
                                {title}
                            </Typography>
                            {subtitle && (
                                <Typography variant="body2" color="text.secondary">
                                    {subtitle}
                                </Typography>
                            )}
                        </Stack>

                        {hasAction && (
                            <Stack
                                direction="row"
                                spacing={0.5}
                                sx={{ alignItems: "center", flexShrink: 0 }}
                            >
                                {action}
                                {showFullScreenButton && (
                                    <FullScreenIconButton
                                        isFullScreen={fullScreen}
                                        onClick={onToggleFullScreen}
                                    />
                                )}
                                {showCloseButton && (
                                    <IconButton aria-label="Close" onClick={onClose}>
                                        <CloseIcon />
                                    </IconButton>
                                )}
                            </Stack>
                        )}
                    </Stack>
                </DialogTitle>
            )}
            {children}
        </MuiDialog>
    )
}
