import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { Provider } from "react-redux"
import { createBrowserRouter, Navigate, RouterProvider } from "react-router"
import { AppLayout } from "@src/components/common/AppLayout"
import { ErrorBoundary } from "@src/components/common/ErrorBoundary"
import { ApplicationDetailsDialogContainer } from "@src/containers/Applications/ApplicationDetailsDialogContainer"
import { ApplicationsPage, ResourcesPage } from "@src/pages"
import { store } from "@src/state/store"
import { theme } from "@src/theme/theme"
import { APP_ROUTES, APPLICATION_DETAILS_PATH } from "@src/types"

const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            { index: true, element: <Navigate to={APP_ROUTES.RESOURCES} replace /> },
            { path: APP_ROUTES.RESOURCES, element: <ResourcesPage /> },
            {
                path: APP_ROUTES.APPLICATIONS,
                element: <ApplicationsPage />,
                children: [
                    {
                        path: APPLICATION_DETAILS_PATH,
                        element: <ApplicationDetailsDialogContainer />,
                    },
                ],
            },
            { path: "*", element: <Navigate to={APP_ROUTES.RESOURCES} replace /> },
        ],
    },
])

export const App = () => (
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ErrorBoundary>
                <RouterProvider router={router} />
            </ErrorBoundary>
        </ThemeProvider>
    </Provider>
)
