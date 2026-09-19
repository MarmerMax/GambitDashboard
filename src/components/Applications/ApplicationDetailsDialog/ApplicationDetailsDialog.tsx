import Alert from "@mui/material/Alert"
import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"
import DialogContent from "@mui/material/DialogContent"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { Dialog } from "@src/components/common/Dialog"
import { CRITICALITY_COLOR } from "@src/theme/statusColors"
import { CRITICALITIES } from "@src/types"
import type { Application, Resource } from "@src/types"
import { ApplicationGraph } from "./ApplicationGraph"
import { ApplicationMemberList } from "./ApplicationMemberList"

export interface ApplicationDetailsDialogPropsType {
    application?: Application
    resources: Resource[]
    isLoading: boolean
    error?: string
    isFullScreen: boolean
    onToggleFullScreen: () => void
    onClose: () => void
}

const LEGEND_DOT_SIZE = 8
const GRAPH_HEIGHT = 380
const FULL_SCREEN_GRAPH_HEIGHT = "60vh"
const LOADING_HEIGHT = 240

export const ApplicationDetailsDialog = ({
    application,
    resources,
    isLoading,
    error,
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
        title={application?.name ?? "Application"}
        subtitle={
            application?.description ??
            `${resources.length} connected resource${resources.length === 1 ? "" : "s"}`
        }
    >
        <DialogContent dividers>
            {error && <Alert severity="error">{error}</Alert>}

            {!error && isLoading && (
                <Stack
                    sx={{ alignItems: "center", justifyContent: "center", height: LOADING_HEIGHT }}
                >
                    <CircularProgress />
                </Stack>
            )}

            {!error && !isLoading && application && (
                <Stack spacing={2}>
                    <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: "wrap" }}>
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
                        height={isFullScreen ? FULL_SCREEN_GRAPH_HEIGHT : GRAPH_HEIGHT}
                    />

                    <ApplicationMemberList resources={resources} />
                </Stack>
            )}
        </DialogContent>
    </Dialog>
)
