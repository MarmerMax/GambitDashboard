import { Outlet } from "react-router"
import { ApplicationsGridContainer } from "@src/containers/Applications/ApplicationsGridContainer"

export const ApplicationsPage = () => (
    <>
        <ApplicationsGridContainer />
        <Outlet />
    </>
)
