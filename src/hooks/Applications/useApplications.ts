import { useCallback, useState } from "react"
import type { Application, ApplicationDraft } from "@src/types"

const createId = () =>
    typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `app-${Date.now()}-${Math.random()}`

export const useApplications = () => {
    const [applications, setApplications] = useState<Application[]>([])
    const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null)

    const createApplication = useCallback(
        ({ name, description, resourceIds }: ApplicationDraft) => {
            const application: Application = {
                id: createId(),
                name: name.trim(),
                description: description.trim() || undefined,
                resourceIds,
            }

            setApplications((current) => [application, ...current])

            return application
        },
        [],
    )

    return {
        applications,
        selectedApplicationId,
        setSelectedApplicationId,
        createApplication,
    }
}
