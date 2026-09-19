import { decodeCursor, encodeCursor, simulateLatency } from "@src/api/common/mockNetwork"
import { SEEDED_APPLICATIONS } from "@src/mock/applications"
import type { Application, ApplicationDraft, CursorPage } from "@src/types"

export interface FetchApplicationsParams {
    search?: string
    page_size: number
    next_token?: string
}

const applications: Application[] = [...SEEDED_APPLICATIONS]

const createId = () =>
    typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `app-${Date.now()}-${Math.random()}`

export const fetchApplications = async (
    params: FetchApplicationsParams,
    signal?: AbortSignal,
): Promise<CursorPage<Application>> => {
    await simulateLatency(signal)

    const search = params.search?.trim().toLowerCase()
    const matched = search
        ? applications.filter((application) => application.name.toLowerCase().includes(search))
        : applications

    const offset = decodeCursor(params.next_token)
    const items = matched.slice(offset, offset + params.page_size)
    const nextOffset = offset + items.length

    return {
        items,
        total: matched.length,
        next_token: nextOffset < matched.length ? encodeCursor(nextOffset) : undefined,
    }
}

export const fetchApplicationById = async (
    id: string,
    signal?: AbortSignal,
): Promise<Application | undefined> => {
    await simulateLatency(signal)

    return applications.find((application) => application.id === id)
}

export const createApplication = async (
    { name, description, resourceIds }: ApplicationDraft,
    signal?: AbortSignal,
): Promise<Application> => {
    await simulateLatency(signal)

    const application: Application = {
        id: createId(),
        name: name.trim(),
        description: description.trim() || undefined,
        resourceIds,
    }

    applications.unshift(application)

    return application
}
