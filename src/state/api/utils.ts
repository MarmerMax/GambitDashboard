import type { SerializedError } from "@reduxjs/toolkit"

export const getErrorMessage = (error?: string | SerializedError) =>
    typeof error === "string" ? error : error?.message
