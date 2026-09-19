import { configureStore } from "@reduxjs/toolkit"
import { baseApi } from "@src/state/api"

import "@src/state/Applications"
import "@src/state/Resources"

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
})

export type RootStateType = ReturnType<typeof store.getState>

export type AppDispatchType = typeof store.dispatch
