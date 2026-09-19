import AppBar from "@mui/material/AppBar"
import Avatar from "@mui/material/Avatar"
import Stack from "@mui/material/Stack"
import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import { Link, useLocation } from "react-router"
import { APP_ROUTES } from "@src/types"

// Uncommenting the avatar below also needs these imports back:
// import IconButton from "@mui/material/IconButton"
// import Tooltip from "@mui/material/Tooltip"
// const PROFILE_URL = "https://www.linkedin.com/in/max-marmer-b8a28a16b/"
// const PROFILE_NAME = "Maksim Marmer"
// const PROFILE_INITIALS = "MM"
// const PROFILE_AVATAR_SRC =
//     "https://media.licdn.com/dms/image/v2/D4D03AQHeMrvjAWUi7Q/profile-displayphoto-crop_800_800/B4DaCF6wqiJ8AI-/0/1788953169239?e=1791417600&v=beta&t=vffn21kiN1TFYBwT574msGEcKNHLwHkWGAqFfl8Czxw"

export const AppHeader = () => {
    const { pathname } = useLocation()
    const activeRoute = pathname.startsWith(APP_ROUTES.APPLICATIONS)
        ? APP_ROUTES.APPLICATIONS
        : APP_ROUTES.RESOURCES

    return (
        <AppBar
            position="sticky"
            color="inherit"
            elevation={0}
            sx={{ borderBottom: 1, borderColor: "divider" }}
        >
            <Toolbar sx={{ gap: 3 }}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                    <Avatar variant="rounded" sx={{ bgcolor: "primary.main", fontWeight: 700 }}>
                        G
                    </Avatar>
                    <Stack sx={{ minWidth: 0 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 650, lineHeight: 1.25 }}>
                            Security App
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Cloud resource explorer
                        </Typography>
                    </Stack>
                </Stack>

                <Tabs value={activeRoute} sx={{ flex: 1 }}>
                    <Tab
                        value={APP_ROUTES.RESOURCES}
                        label="Resources"
                        component={Link}
                        to={APP_ROUTES.RESOURCES}
                    />
                    <Tab
                        value={APP_ROUTES.APPLICATIONS}
                        label="Applications"
                        component={Link}
                        to={APP_ROUTES.APPLICATIONS}
                    />
                </Tabs>

                {/* <Tooltip title={PROFILE_NAME}>
                    <IconButton
                        component="a"
                        href={PROFILE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${PROFILE_NAME} profile`}
                    >
                        <Avatar src={PROFILE_AVATAR_SRC}>{PROFILE_INITIALS}</Avatar>
                    </IconButton>
                </Tooltip> */}
            </Toolbar>
        </AppBar>
    )
}
