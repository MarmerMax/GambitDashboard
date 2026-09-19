import { Outlet } from "react-router"
import { ApplicationsGridContainer } from "@src/containers/Applications"

export const ApplicationsPage = () => (
    <>
        <ApplicationsGridContainer />
        <Outlet />
    </>
)
