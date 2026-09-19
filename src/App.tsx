import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { ErrorBoundary } from "./components/common/ErrorBoundary"
import { DashboardPage } from "./pages/DashboardPage"
import { theme } from "./theme/theme"

export const App = () => (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
            <DashboardPage />
        </ErrorBoundary>
    </ThemeProvider>
)
