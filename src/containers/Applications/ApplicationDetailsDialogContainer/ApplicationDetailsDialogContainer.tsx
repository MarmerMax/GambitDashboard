import { useCallback, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { ApplicationDetailsDialog } from "@src/components/Applications"
import { useGetApplicationQuery } from "@src/state/Applications"
import { getErrorMessage } from "@src/state/api"
import { useGetResourcesByIdsQuery } from "@src/state/Resources"
import { APP_ROUTES } from "@src/types"
import type { Resource } from "@src/types"

const NOT_FOUND_ERROR = "This application no longer exists."
const EMPTY_IDS: string[] = []
const EMPTY_RESOURCES: Resource[] = []

export const ApplicationDetailsDialogContainer = () => {
    const { applicationId } = useParams()
    const navigate = useNavigate()

    const [isFullScreen, setIsFullScreen] = useState(false)
    const [selectedResourceId, setSelectedResourceId] = useState<string>()

    const {
        data: application,
        isFetching: isApplicationFetching,
        error: applicationError,
    } = useGetApplicationQuery(applicationId ?? "", { skip: !applicationId })

    const resourceIds = application?.resourceIds ?? EMPTY_IDS

    const {
        data: resources = EMPTY_RESOURCES,
        isFetching: areResourcesFetching,
        error: resourcesError,
    } = useGetResourcesByIdsQuery(resourceIds, { skip: resourceIds.length === 0 })

    const handleSelectResource = useCallback(
        (id: string) => setSelectedResourceId((current) => (current === id ? undefined : id)),
        [],
    )

    const handleToggleFullScreen = useCallback(() => setIsFullScreen((current) => !current), [])

    const handleClose = useCallback(() => {
        setIsFullScreen(false)
        navigate(APP_ROUTES.APPLICATIONS)
    }, [navigate])

    const isLoading = isApplicationFetching || areResourcesFetching
    const isMissing = !isLoading && !application

    const error =
        getErrorMessage(applicationError) ??
        getErrorMessage(resourcesError) ??
        (isMissing ? NOT_FOUND_ERROR : undefined)

    return (
        <ApplicationDetailsDialog
            application={application}
            resources={resources}
            isLoading={isLoading}
            error={error}
            selectedResourceId={selectedResourceId}
            onSelectResource={handleSelectResource}
            isFullScreen={isFullScreen}
            onToggleFullScreen={handleToggleFullScreen}
            onClose={handleClose}
        />
    )
}
