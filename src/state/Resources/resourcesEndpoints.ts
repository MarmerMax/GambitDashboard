import type { FetchResourcesParams } from "@src/api/Resources"
import { fetchResources, fetchResourcesByIds } from "@src/api/Resources"
import { baseApi } from "@src/state/api"
import type { CursorPage, Resource } from "@src/types"

const LIST_ERROR = "Could not load resources."
const BY_IDS_ERROR = "Could not load the resources of this application."

export const resourcesEndpoints = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getResources: builder.query<CursorPage<Resource>, FetchResourcesParams>({
            queryFn: async (params, api) => {
                try {
                    return { data: await fetchResources(params, api.signal) }
                } catch {
                    return { error: LIST_ERROR }
                }
            },
        }),
        getResourcesByIds: builder.query<Resource[], string[]>({
            queryFn: async (ids, api) => {
                try {
                    return { data: await fetchResourcesByIds(ids, api.signal) }
                } catch {
                    return { error: BY_IDS_ERROR }
                }
            },
        }),
    }),
})

export const { useGetResourcesQuery, useGetResourcesByIdsQuery } = resourcesEndpoints
