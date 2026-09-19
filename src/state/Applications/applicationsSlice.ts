import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { FetchApplicationsParams } from "@src/api/Applications/applicationsApi"
import { fetchApplications } from "@src/api/Applications/applicationsApi"
import type { Application } from "@src/types"

export interface ApplicationsStateType {
    entities: Record<string, Application>
    list: {
        ids: string[]
        total: number
        isLoading: boolean
        error?: string
    }
}

const LIST_ERROR = "Could not load applications."

const INITIAL_STATE: ApplicationsStateType = {
    entities: {},
    list: { ids: [], total: 0, isLoading: true },
}

export const fetchApplicationsPage = createAsyncThunk(
    "applications/fetchPage",
    (params: FetchApplicationsParams, { signal }) => fetchApplications(params, signal),
)

export const applicationsSlice = createSlice({
    name: "applications",
    initialState: INITIAL_STATE,
    reducers: {
        upsertApplication: (state, action: PayloadAction<Application>) => {
            state.entities[action.payload.id] = action.payload
        },
        addApplication: (state, action: PayloadAction<Application>) => {
            state.entities[action.payload.id] = action.payload
            state.list.ids = [action.payload.id, ...state.list.ids]
            state.list.total += 1
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchApplicationsPage.pending, (state) => {
                state.list.error = undefined
                state.list.isLoading = true
            })
            .addCase(fetchApplicationsPage.fulfilled, (state, action) => {
                action.payload.items.forEach((application) => {
                    state.entities[application.id] = application
                })
                state.list.ids = action.payload.items.map((application) => application.id)
                state.list.total = action.payload.total
                state.list.isLoading = false
            })
            .addCase(fetchApplicationsPage.rejected, (state, action) => {
                if (action.meta.aborted) return

                state.list.error = LIST_ERROR
                state.list.isLoading = false
            })
    },
})

export const applicationsReducer = applicationsSlice.reducer

export const { addApplication, upsertApplication } = applicationsSlice.actions
