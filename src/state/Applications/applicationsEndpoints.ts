import type { FetchApplicationsParams } from "@src/api/Applications"
import { createApplication, fetchApplicationById, fetchApplications } from "@src/api/Applications"
import { API_TAG, baseApi, LIST_ID } from "@src/state/api"
import type { Application, ApplicationDraft, CursorPage } from "@src/types"

const LIST_ERROR = "Could not load applications."
const DETAILS_ERROR = "Could not load this application."
const CREATE_ERROR = "Could not create the application. Please try again."

export const applicationsEndpoints = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getApplications: builder.query<CursorPage<Application>, FetchApplicationsParams>({
            queryFn: async (params, api) => {
                try {
                    return { data: await fetchApplications(params, api.signal) }
                } catch {
                    return { error: LIST_ERROR }
                }
            },
            providesTags: [{ type: API_TAG.APPLICATION, id: LIST_ID }],
        }),
        getApplication: builder.query<Application | undefined, string>({
            queryFn: async (id, api) => {
                try {
                    return { data: await fetchApplicationById(id, api.signal) }
                } catch {
                    return { error: DETAILS_ERROR }
                }
            },
            providesTags: (_result, _error, id) => [{ type: API_TAG.APPLICATION, id }],
        }),
        createApplication: builder.mutation<Application, ApplicationDraft>({
            queryFn: async (draft, api) => {
                try {
                    return { data: await createApplication(draft, api.signal) }
                } catch {
                    return { error: CREATE_ERROR }
                }
            },
            invalidatesTags: [{ type: API_TAG.APPLICATION, id: LIST_ID }],
        }),
    }),
})

export const { useGetApplicationsQuery, useGetApplicationQuery, useCreateApplicationMutation } =
    applicationsEndpoints
