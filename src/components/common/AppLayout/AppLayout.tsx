import { Container, Stack } from "@mui/material"
import { Outlet } from "react-router"
import { AppHeader } from "../AppHeader"

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
