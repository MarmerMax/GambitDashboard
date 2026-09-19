import { Alert, Box, CircularProgress, DialogContent, Stack, Typography } from "@mui/material"
import { Dialog } from "@src/components/common"
import { CRITICALITY_COLOR } from "@src/theme"
import { CRITICALITIES } from "@src/types"
import type { Application, Resource } from "@src/types"
import { ApplicationGraph } from "./ApplicationGraph"

export interface ApplicationDetailsDialogPropsType {
    application?: Application
    resources: Resource[]
    isLoading: boolean
    error?: string
    selectedResourceId?: string
    onSelectResource: (id: string) => void
    isFullScreen: boolean
    onToggleFullScreen: () => void
    onClose: () => void
}

const LEGEND_DOT_SIZE = 8
const LOADING_HEIGHT = 240

export const ApplicationDetailsDialog = ({
    application,
    resources,
    isLoading,
    error,
    selectedResourceId,
    onSelectResource,
    isFullScreen,
    onToggleFullScreen,
    onClose,
}: ApplicationDetailsDialogPropsType) => (
    <Dialog
        open
        fullWidth
        maxWidth="lg"
        showFullScreenButton
        fullScreen={isFullScreen}
        onToggleFullScreen={onToggleFullScreen}
        onClose={onClose}
        slotProps={{ paper: { sx: { height: "100%" } } }}
        title={application?.name ?? "Application"}
        subtitle={
            application?.description ??
            `${resources.length} connected resource${resources.length === 1 ? "" : "s"}`
        }
    >
        <DialogContent
            dividers
            sx={{ display: "flex", flexDirection: "column", overflow: "hidden" }}
        >
            {error && <Alert severity="error">{error}</Alert>}

            {!error && isLoading && (
                <Stack
                    sx={{ alignItems: "center", justifyContent: "center", height: LOADING_HEIGHT }}
                >
                    <CircularProgress />
                </Stack>
            )}

            {!error && !isLoading && application && (
                <Stack spacing={2} sx={{ flex: 1, minHeight: 0 }}>
                    <Stack
                        direction="row"
                        spacing={1.5}
                        useFlexGap
                        sx={{ flexWrap: "wrap", flexShrink: 0 }}
                    >
                        {CRITICALITIES.map((criticality) => (
                            <Stack
                                key={criticality}
                                direction="row"
                                spacing={0.75}
                                sx={{ alignItems: "center" }}
                            >
                                <Box
                                    sx={{
                                        width: LEGEND_DOT_SIZE,
                                        height: LEGEND_DOT_SIZE,
                                        borderRadius: "50%",
                                        backgroundColor: CRITICALITY_COLOR[criticality],
                                    }}
                                />
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ textTransform: "capitalize" }}
                                >
                                    {criticality}
                                </Typography>
                            </Stack>
                        ))}
                    </Stack>

                    <ApplicationGraph
                        application={application}
                        resources={resources}
                        selectedResourceId={selectedResourceId}
                        onSelectResource={onSelectResource}
                    />
                </Stack>
            )}
        </DialogContent>
    </Dialog>
)
