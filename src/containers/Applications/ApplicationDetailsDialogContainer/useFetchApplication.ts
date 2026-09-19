import { useEffect, useState } from "react"
import { fetchApplicationById } from "@src/api/Applications/applicationsApi"
import { isAbortError } from "@src/api/common/mockNetwork"
import { upsertApplication } from "@src/state/Applications/applicationsSlice"
import { useAppDispatch, useAppSelector } from "@src/state/hooks"

const NOT_FOUND_ERROR = "This application no longer exists."
const LOAD_ERROR = "Could not load this application."

export type UseFetchApplicationPropsType = {
    applicationId?: string
}

export const useFetchApplication = ({ applicationId }: UseFetchApplicationPropsType) => {
    const dispatch = useAppDispatch()

    const [isApplicationLoading, setIsApplicationLoading] = useState(false)
    const [applicationError, setApplicationError] = useState<string>()

    const applications = useAppSelector((store) => store.applications)
    const { entities, list } = applications
    const application = applicationId ? entities[applicationId] : undefined

    useEffect(() => {
        if (!applicationId || application || list.isLoading) return

        const controller = new AbortController()

        setApplicationError(undefined)
        setIsApplicationLoading(true)

        fetchApplicationById(applicationId, controller.signal)
            .then((found) => {
                if (found) dispatch(upsertApplication(found))
                else setApplicationError(NOT_FOUND_ERROR)

                setIsApplicationLoading(false)
            })
            .catch((error: unknown) => {
                if (isAbortError(error)) return

                setApplicationError(LOAD_ERROR)
                setIsApplicationLoading(false)
            })

        return () => controller.abort()
    }, [dispatch, applicationId, application, list.isLoading])

    return {
        error: applicationError || list.error,
        isLoading: isApplicationLoading || list.isLoading,
        application,
    }
}
