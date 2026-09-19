import Container from "@mui/material/Container"
import Stack from "@mui/material/Stack"
import { Outlet } from "react-router"
import { AppHeader } from "@src/components/common/AppHeader"

export const AppLayout = () => (
    <Stack sx={{ height: "100vh" }}>
        <AppHeader />

        <Container
            maxWidth="xl"
            sx={{ py: 3, display: "flex", flex: { lg: 1 }, minHeight: 0, height: "100%" }}
        >
            <Outlet />
        </Container>
    </Stack>
)
