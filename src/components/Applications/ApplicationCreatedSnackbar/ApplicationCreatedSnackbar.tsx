import Alert from "@mui/material/Alert"
import Link from "@mui/material/Link"
import Snackbar from "@mui/material/Snackbar"
import { Link as RouterLink } from "react-router"
import { APP_ROUTES } from "@src/types"
import type { Application } from "@src/types"

export interface ApplicationCreatedSnackbarPropsType {
    application?: Application
    onClose: () => void
}

const AUTO_HIDE_DURATION_MS = 8000

export const ApplicationCreatedSnackbar = ({
    application,
    onClose,
}: ApplicationCreatedSnackbarPropsType) => (
    <Snackbar
        open={Boolean(application)}
        autoHideDuration={AUTO_HIDE_DURATION_MS}
        onClose={onClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
        <Alert severity="success" variant="filled" onClose={onClose}>
            Application created successfully. To open{" "}
            <Link
                component={RouterLink}
                to={`${APP_ROUTES.APPLICATIONS}/${application?.id}`}
                color="inherit"
                underline="always"
                onClick={onClose}
            >
                click here
            </Link>
        </Alert>
    </Snackbar>
)
