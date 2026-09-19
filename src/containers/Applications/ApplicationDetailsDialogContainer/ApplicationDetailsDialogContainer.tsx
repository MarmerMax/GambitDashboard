import { useCallback, useMemo, useState } from "react"
import { ApplicationDetailsDialog } from "@src/components/Applications/ApplicationDetailsDialog"
import type { Application, Resource } from "@src/types"

export interface ApplicationDetailsDialogContainerPropsType {
    application?: Application
    getResources: (ids: string[]) => Resource[]
    onClose: () => void
}

export const ApplicationDetailsDialogContainer = ({
    application,
    getResources,
    onClose,
}: ApplicationDetailsDialogContainerPropsType) => {
    const [isFullScreen, setIsFullScreen] = useState(false)

    const resources = useMemo(
        () => (application ? getResources(application.resourceIds) : []),
        [application, getResources],
    )

    const handleToggleFullScreen = useCallback(() => setIsFullScreen((current) => !current), [])

    const handleClose = useCallback(() => {
        setIsFullScreen(false)
        onClose()
    }, [onClose])

    if (!application) return null

    return (
        <ApplicationDetailsDialog
            application={application}
            resources={resources}
            isFullScreen={isFullScreen}
            onToggleFullScreen={handleToggleFullScreen}
            onClose={handleClose}
        />
    )
}
