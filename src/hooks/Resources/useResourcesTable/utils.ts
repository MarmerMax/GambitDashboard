import type { ResourceSortField } from "@src/types"
import { SORTABLE_FIELDS, type TokensByPage } from "./tableReducer"

export const DEFAULT_PAGE_SIZE = 25
export const SEARCH_DEBOUNCE_MS = 350
export const FIRST_PAGE = 0
export const INITIAL_TOKENS: TokensByPage = { [FIRST_PAGE]: undefined }

export const isSortableField = (field: string): field is ResourceSortField =>
    SORTABLE_FIELDS.some((sortable) => sortable === field)
