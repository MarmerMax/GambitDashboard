import type { TokensByPage } from "@src/types"
import { DEFAULT_PAGE_SIZE, FIRST_PAGE, hasToken, INITIAL_TOKENS } from "./utils"

export interface TableStateType {
    search: string
    page: number
    pageSize: number
    tokens: TokensByPage
}

export type TableActionType =
    | { type: "SET_SEARCH"; value: string }
    | { type: "SET_PAGINATION"; page: number; pageSize: number }
    | { type: "PAGE_LOADED"; page: number; nextToken?: string }

export const INITIAL_STATE: TableStateType = {
    search: "",
    page: FIRST_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    tokens: INITIAL_TOKENS,
}

export const tableReducer = (state: TableStateType, action: TableActionType): TableStateType => {
    switch (action.type) {
        case "SET_SEARCH":
            return { ...state, search: action.value, page: FIRST_PAGE, tokens: INITIAL_TOKENS }
        case "SET_PAGINATION":
            if (action.pageSize !== state.pageSize) {
                return {
                    ...state,
                    page: FIRST_PAGE,
                    pageSize: action.pageSize,
                    tokens: INITIAL_TOKENS,
                }
            }

            return hasToken(state, action.page)
                ? { ...state, page: action.page }
                : { ...state, page: FIRST_PAGE }
        case "PAGE_LOADED":
            return { ...state, tokens: { ...state.tokens, [action.page + 1]: action.nextToken } }
    }
}
