import AppBar from "@mui/material/AppBar"
import Avatar from "@mui/material/Avatar"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Toolbar from "@mui/material/Toolbar"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"

const PROFILE_URL = "https://www.linkedin.com/in/max-marmer-b8a28a16b/"
const PROFILE_NAME = "Maksim Marmer"
const PROFILE_INITIALS = "MM"
const PROFILE_AVATAR_SRC =
    "https://media.licdn.com/dms/image/v2/D4D03AQHeMrvjAWUi7Q/profile-displayphoto-crop_800_800/B4DaCF6wqiJ8AI-/0/1788953169239?e=1791417600&v=beta&t=vffn21kiN1TFYBwT574msGEcKNHLwHkWGAqFfl8Czxw"

export const AppHeader = () => (
    <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{ borderBottom: 1, borderColor: "divider" }}
    >
        <Toolbar sx={{ gap: 1.5 }}>
            <Avatar variant="rounded" sx={{ bgcolor: "primary.main", fontWeight: 700 }}>
                G
            </Avatar>
            <Stack sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 650, lineHeight: 1.25 }}>
                    Gambit Security
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Cloud resource explorer
                </Typography>
            </Stack>
            <Tooltip title={PROFILE_NAME}>
                <IconButton
                    component="a"
                    href={PROFILE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${PROFILE_NAME} profile`}
                >
                    <Avatar src={PROFILE_AVATAR_SRC}>{PROFILE_INITIALS}</Avatar>
                </IconButton>
            </Tooltip>
        </Toolbar>
    </AppBar>
)
