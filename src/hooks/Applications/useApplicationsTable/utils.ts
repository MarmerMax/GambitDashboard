import type { Application } from "@src/types"
import type { TokensByPage } from "@src/types"
import type { TableStateType } from "./tableReducers"

export const DEFAULT_PAGE_SIZE = 25
export const SEARCH_DEBOUNCE_MS = 350
export const FIRST_PAGE = 0
export const EMPTY_ROWS: Application[] = []
export const EMPTY_TOTAL = 0
export const INITIAL_TOKENS: TokensByPage = { [FIRST_PAGE]: undefined }

export const hasToken = (state: TableStateType, page: number) =>
    page === FIRST_PAGE || state.tokens[page] !== undefined
