import { useMemo } from "react"
import { ApplicationsPanel } from "@src/components/Applications/ApplicationsPanel"
import type { Application, Resource } from "@src/types"

export interface ApplicationsPanelContainerPropsType {
    applications: Application[]
    selectedApplicationId: string | null
    getResources: (ids: string[]) => Resource[]
    onSelect: (id: string) => void
}

export const ApplicationsPanelContainer = ({
    applications,
    selectedApplicationId,
    getResources,
    onSelect,
}: ApplicationsPanelContainerPropsType) => {
    const items = useMemo(
        () =>
            applications.map((application) => ({
                application,
                resources: getResources(application.resourceIds),
            })),
        [applications, getResources],
    )

    return (
        <ApplicationsPanel
            items={items}
            selectedApplicationId={selectedApplicationId}
            onSelect={onSelect}
        />
    )
}
