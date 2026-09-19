import { configureStore } from "@reduxjs/toolkit"
import { applicationsReducer } from "@src/state/Applications/applicationsSlice"
import { resourcesReducer } from "@src/state/Resources/resourcesSlice"

export const store = configureStore({
    reducer: {
        resources: resourcesReducer,
        applications: applicationsReducer,
    },
})

export type RootStateType = ReturnType<typeof store.getState>

export type AppDispatchType = typeof store.dispatch
