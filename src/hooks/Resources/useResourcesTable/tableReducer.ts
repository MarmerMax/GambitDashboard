import { EMPTY_FILTERS } from "@src/types"
import type { TokensByPage } from "@src/types"
import type {
    Criticality,
    Environment,
    Provider,
    ResourceFilters,
    ResourceSortField,
    SortDirection,
} from "@src/types"
import { DEFAULT_PAGE_SIZE, FIRST_PAGE, INITIAL_TOKENS } from "./utils"

export const SORTABLE_FIELDS: readonly ResourceSortField[] = [
    "name",
    "type",
    "provider",
    "region",
    "environment",
    "criticality",
    "owner",
    "openIssues",
]

interface TableState {
    filters: ResourceFilters
    sortField?: ResourceSortField
    sortDirection?: SortDirection
    page: number
    pageSize: number
    tokens: TokensByPage
}

export enum TABLE_ACTION_TYPE {
    SET_SEARCH = "SET_SEARCH",
    SET_PROVIDER = "SET_PROVIDER",
    SET_ENVIRONMENT = "SET_ENVIRONMENT",
    SET_CRITICALITY = "SET_CRITICALITY",
    RESET_FILTERS = "RESET_FILTERS",
    SET_SORT = "SET_SORT",
    SET_PAGINATION = "SET_PAGINATION",
    PAGE_LOADED = "PAGE_LOADED",
}

export type TableAction =
    | { type: TABLE_ACTION_TYPE.SET_SEARCH; value: string }
    | { type: TABLE_ACTION_TYPE.SET_PROVIDER; value?: Provider }
    | { type: TABLE_ACTION_TYPE.SET_ENVIRONMENT; value?: Environment }
    | { type: TABLE_ACTION_TYPE.SET_CRITICALITY; value?: Criticality }
    | { type: TABLE_ACTION_TYPE.RESET_FILTERS }
    | { type: TABLE_ACTION_TYPE.SET_SORT; field?: ResourceSortField; direction?: SortDirection }
    | { type: TABLE_ACTION_TYPE.SET_PAGINATION; page: number; pageSize: number }
    | { type: TABLE_ACTION_TYPE.PAGE_LOADED; page: number; nextToken?: string }

export const INITIAL_STATE: TableState = {
    filters: EMPTY_FILTERS,
    page: FIRST_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    tokens: INITIAL_TOKENS,
}

export const withFilters = (state: TableState, filters: ResourceFilters): TableState => ({
    ...state,
    filters,
    page: FIRST_PAGE,
    tokens: INITIAL_TOKENS,
})

const hasToken = (state: TableState, page: number) =>
    page === FIRST_PAGE || state.tokens[page] !== undefined

export const tableReducer = (state: TableState, action: TableAction): TableState => {
    switch (action.type) {
        case TABLE_ACTION_TYPE.SET_SEARCH:
            return withFilters(state, { ...state.filters, search: action.value })
        case TABLE_ACTION_TYPE.SET_PROVIDER:
            return withFilters(state, { ...state.filters, provider: action.value })
        case TABLE_ACTION_TYPE.SET_ENVIRONMENT:
            return withFilters(state, { ...state.filters, environment: action.value })
        case TABLE_ACTION_TYPE.SET_CRITICALITY:
            return withFilters(state, { ...state.filters, criticality: action.value })
        case TABLE_ACTION_TYPE.RESET_FILTERS:
            return withFilters(state, EMPTY_FILTERS)
        case TABLE_ACTION_TYPE.SET_SORT:
            return {
                ...state,
                sortField: action.field,
                sortDirection: action.direction,
                page: FIRST_PAGE,
                tokens: INITIAL_TOKENS,
            }
        case TABLE_ACTION_TYPE.SET_PAGINATION:
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
        case TABLE_ACTION_TYPE.PAGE_LOADED:
            return { ...state, tokens: { ...state.tokens, [action.page + 1]: action.nextToken } }
    }
}
