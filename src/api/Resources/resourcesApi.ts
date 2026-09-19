import { RESOURCES } from "@src/mock/resources"
import type {
    Criticality,
    CursorPage,
    Environment,
    Resource,
    ResourceSortField,
    SortDirection,
} from "@src/types"
import type { Provider } from "@src/types"
import { decodeCursor, encodeCursor, simulateLatency } from "@src/api/common/mockNetwork"

export interface FetchResourcesParams {
    search?: string
    provider?: Provider
    environment?: Environment
    criticality?: Criticality
    sort_by?: ResourceSortField
    sort_dir?: SortDirection
    page_size: number
    next_token?: string
}

const CRITICALITY_RANK: Record<Criticality, number> = { low: 0, medium: 1, high: 2, critical: 3 }
const ENVIRONMENT_RANK: Record<Environment, number> = { development: 0, staging: 1, production: 2 }

const matchesParams = (resource: Resource, params: FetchResourcesParams) => {
    const search = params.search?.trim().toLowerCase()

    return (
        (!search || resource.name.toLowerCase().includes(search)) &&
        (!params.provider || resource.provider === params.provider) &&
        (!params.environment || resource.environment === params.environment) &&
        (!params.criticality || resource.criticality === params.criticality)
    )
}

const compareByField = (left: Resource, right: Resource, field: ResourceSortField) => {
    switch (field) {
        case "openIssues":
            return left.openIssues - right.openIssues
        case "criticality":
            return CRITICALITY_RANK[left.criticality] - CRITICALITY_RANK[right.criticality]
        case "environment":
            return ENVIRONMENT_RANK[left.environment] - ENVIRONMENT_RANK[right.environment]
        default:
            return left[field].localeCompare(right[field])
    }
}

const sortResources = (resources: Resource[], params: FetchResourcesParams) => {
    if (!params.sort_by) return resources

    const field = params.sort_by
    const direction = params.sort_dir === "desc" ? -1 : 1

    return [...resources].sort((left, right) => compareByField(left, right, field) * direction)
}

export const fetchResources = async (
    params: FetchResourcesParams,
    signal?: AbortSignal,
): Promise<CursorPage<Resource>> => {
    await simulateLatency(signal)

    const matched = sortResources(
        RESOURCES.filter((resource) => matchesParams(resource, params)),
        params,
    )

    const offset = decodeCursor(params.next_token)
    const items = matched.slice(offset, offset + params.page_size)
    const nextOffset = offset + items.length

    return {
        items,
        total: matched.length,
        next_token: nextOffset < matched.length ? encodeCursor(nextOffset) : undefined,
    }
}
