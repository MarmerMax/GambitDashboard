import type { GridPaginationModel, GridSortModel } from "@mui/x-data-grid"
import { useCallback, useEffect, useMemo, useReducer } from "react"
import type { FetchResourcesParams } from "@src/api/Resources"
import { useDebouncedValue } from "@src/hooks/common"
import { getErrorMessage } from "@src/state/api"
import { useGetResourcesQuery } from "@src/state/Resources"
import type { Criticality, Environment, Provider, Resource } from "@src/types"
import { INITIAL_STATE, TABLE_ACTION_TYPE, tableReducer } from "./tableReducer"
import { isSortableField, SEARCH_DEBOUNCE_MS } from "./utils"

const EMPTY_ROWS: Resource[] = []
const EMPTY_TOTAL = 0

export const useResourcesTable = () => {
    const [state, dispatch] = useReducer(tableReducer, INITIAL_STATE)

    const debouncedSearch = useDebouncedValue(state.filters.search, SEARCH_DEBOUNCE_MS)
    const token = state.tokens[state.page]

    const params = useMemo<FetchResourcesParams>(
        () => ({
            search: debouncedSearch.trim() || undefined,
            provider: state.filters.provider,
            environment: state.filters.environment,
            criticality: state.filters.criticality,
            sort_by: state.sortField,
            sort_dir: state.sortDirection,
            page_size: state.pageSize,
            next_token: token,
        }),
        [
            debouncedSearch,
            state.filters.provider,
            state.filters.environment,
            state.filters.criticality,
            state.sortField,
            state.sortDirection,
            state.pageSize,
            token,
        ],
    )

    const page = state.page

    const { data, isFetching, error, refetch } = useGetResourcesQuery(params)

    useEffect(() => {
        if (!data) return
        dispatch({ type: TABLE_ACTION_TYPE.PAGE_LOADED, page, nextToken: data.next_token })
    }, [data, page])

    const paginationModel = useMemo<GridPaginationModel>(
        () => ({ page: state.page, pageSize: state.pageSize }),
        [state.page, state.pageSize],
    )

    const sortModel = useMemo<GridSortModel>(
        () => (state.sortField ? [{ field: state.sortField, sort: state.sortDirection }] : []),
        [state.sortField, state.sortDirection],
    )

    const setSearch = useCallback(
        (value: string) => dispatch({ type: TABLE_ACTION_TYPE.SET_SEARCH, value }),
        [],
    )

    const setProvider = useCallback(
        (value?: Provider) => dispatch({ type: TABLE_ACTION_TYPE.SET_PROVIDER, value }),
        [],
    )

    const setEnvironment = useCallback(
        (value?: Environment) => dispatch({ type: TABLE_ACTION_TYPE.SET_ENVIRONMENT, value }),
        [],
    )

    const setCriticality = useCallback(
        (value?: Criticality) => dispatch({ type: TABLE_ACTION_TYPE.SET_CRITICALITY, value }),
        [],
    )

    const resetFilters = useCallback(() => dispatch({ type: TABLE_ACTION_TYPE.RESET_FILTERS }), [])

    const handlePaginationModelChange = useCallback(
        ({ page: nextPage, pageSize: nextPageSize }: GridPaginationModel) =>
            dispatch({
                type: TABLE_ACTION_TYPE.SET_PAGINATION,
                page: nextPage,
                pageSize: nextPageSize,
            }),
        [],
    )

    const handleSortModelChange = useCallback((model: GridSortModel) => {
        const [entry] = model

        if (!entry || !entry.sort || !isSortableField(entry.field)) {
            dispatch({ type: TABLE_ACTION_TYPE.SET_SORT })

            return
        }

        dispatch({ type: TABLE_ACTION_TYPE.SET_SORT, field: entry.field, direction: entry.sort })
    }, [])

    const hasActiveFilters = useMemo(
        () =>
            state.filters.search !== "" ||
            Boolean(state.filters.provider) ||
            Boolean(state.filters.environment) ||
            Boolean(state.filters.criticality),
        [state.filters],
    )

    return {
        rows: data?.items ?? EMPTY_ROWS,
        rowCount: data?.total ?? EMPTY_TOTAL,
        isLoading: isFetching,
        error: getErrorMessage(error),
        filters: state.filters,
        hasActiveFilters,
        paginationModel,
        sortModel,
        setSearch,
        setProvider,
        setEnvironment,
        setCriticality,
        resetFilters,
        handlePaginationModelChange,
        handleSortModelChange,
        retry: refetch,
    }
}
