import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { FetchResourcesParams } from "@src/api/Resources/resourcesApi"
import {
    fetchResources,
    fetchResourcesByIds as fetchResourcesByIdsApi,
} from "@src/api/Resources/resourcesApi"
import type { Resource } from "@src/types"

export interface ResourcesStateType {
    entities: Record<string, Resource>
    list: {
        ids: string[]
        total: number
        isLoading: boolean
        error?: string
    }
    byIds: {
        isLoading: boolean
        error?: string
    }
}

const LIST_ERROR = "Could not load resources."
const BY_IDS_ERROR = "Could not load the resources of this application."

const INITIAL_STATE: ResourcesStateType = {
    entities: {},
    list: { ids: [], total: 0, isLoading: true },
    byIds: { isLoading: false },
}

const mergeEntities = (state: ResourcesStateType, resources: Resource[]) =>
    resources.forEach((resource) => {
        state.entities[resource.id] = resource
    })

export const fetchResourcesPage = createAsyncThunk(
    "resources/fetchPage",
    (params: FetchResourcesParams, { signal }) => fetchResources(params, signal),
)

export const fetchResourcesByIds = createAsyncThunk(
    "resources/fetchByIds",
    (ids: string[], { signal }) => fetchResourcesByIdsApi(ids, signal),
)

export const resourcesSlice = createSlice({
    name: "resources",
    initialState: INITIAL_STATE,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchResourcesPage.pending, (state) => {
                state.list.error = undefined
                state.list.isLoading = true
            })
            .addCase(fetchResourcesPage.fulfilled, (state, action) => {
                mergeEntities(state, action.payload.items)
                state.list.ids = action.payload.items.map((resource) => resource.id)
                state.list.total = action.payload.total
                state.list.isLoading = false
            })
            .addCase(fetchResourcesPage.rejected, (state, action) => {
                if (action.meta.aborted) return

                state.list.error = LIST_ERROR
                state.list.isLoading = false
            })

            .addCase(fetchResourcesByIds.pending, (state) => {
                state.byIds.error = undefined
                state.byIds.isLoading = true
            })
            .addCase(fetchResourcesByIds.fulfilled, (state, action) => {
                mergeEntities(state, action.payload)
                state.byIds.isLoading = false
            })
            .addCase(fetchResourcesByIds.rejected, (state, action) => {
                if (action.meta.aborted) return

                state.byIds.error = BY_IDS_ERROR
                state.byIds.isLoading = false
            })
    },
})

export const resourcesReducer = resourcesSlice.reducer
