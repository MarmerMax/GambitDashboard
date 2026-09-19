import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { ApplicationDetailsDialog } from "@src/components/Applications/ApplicationDetailsDialog"
import { useAppDispatch, useAppSelector } from "@src/state/hooks"
import { fetchResourcesByIds } from "@src/state/Resources/resourcesSlice"
import { APP_ROUTES } from "@src/types"
import type { Resource } from "@src/types"
import { useFetchApplication } from "./useFetchApplication"

const ID_SEPARATOR = ","

export const ApplicationDetailsDialogContainer = () => {
    const { applicationId } = useParams()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const {
        application,
        error: applicationError,
        isLoading: isApplicationLoading,
    } = useFetchApplication({ applicationId })

    const [isFullScreen, setIsFullScreen] = useState(false)

    const resources = useAppSelector((store) => store.resources)

    const missingIds = useMemo(
        () =>
            (application?.resourceIds ?? [])
                .filter((id) => !resources.entities[id])
                .join(ID_SEPARATOR),
        [application, resources.entities],
    )

    useEffect(() => {
        if (!missingIds) return

        const request = dispatch(fetchResourcesByIds(missingIds.split(ID_SEPARATOR)))

        return () => request.abort()
    }, [dispatch, missingIds])

    const applicationResources = useMemo(
        () =>
            (application?.resourceIds ?? [])
                .map((id) => resources.entities[id])
                .filter((resource): resource is Resource => Boolean(resource)),
        [application, resources.entities],
    )

    const handleToggleFullScreen = useCallback(() => setIsFullScreen((current) => !current), [])

    const handleClose = useCallback(() => {
        setIsFullScreen(false)
        navigate(APP_ROUTES.APPLICATIONS)
    }, [navigate])

    const isLoading = isApplicationLoading || resources.list.isLoading
    const error = applicationError ?? resources.list.error

    return (
        <ApplicationDetailsDialog
            application={application}
            resources={applicationResources}
            isLoading={isLoading}
            error={error}
            isFullScreen={isFullScreen}
            onToggleFullScreen={handleToggleFullScreen}
            onClose={handleClose}
        />
    )
}
