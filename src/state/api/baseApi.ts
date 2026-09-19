import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react"

export const API_TAG = {
    APPLICATION: "Application",
} as const

export const LIST_ID = "LIST"

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: fakeBaseQuery<string>(),
    tagTypes: [API_TAG.APPLICATION],
    endpoints: () => ({}),
})
