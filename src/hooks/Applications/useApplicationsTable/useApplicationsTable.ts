import type { GridPaginationModel } from "@mui/x-data-grid"
import { useCallback, useEffect, useMemo, useReducer } from "react"
import type { FetchApplicationsParams } from "@src/api/Applications"
import { useGetApplicationsQuery } from "@src/state/Applications"
import { getErrorMessage } from "@src/state/api"
import { useDebouncedValue } from "@src/hooks/common"
import { INITIAL_STATE, tableReducer } from "./tableReducers"
import { EMPTY_ROWS, EMPTY_TOTAL, SEARCH_DEBOUNCE_MS } from "./utils"

export const useApplicationsTable = () => {
    const [state, dispatch] = useReducer(tableReducer, INITIAL_STATE)

    const debouncedSearch = useDebouncedValue(state.search, SEARCH_DEBOUNCE_MS)
    const token = state.tokens[state.page]

    const params = useMemo<FetchApplicationsParams>(
        () => ({
            search: debouncedSearch.trim() || undefined,
            page_size: state.pageSize,
            next_token: token,
        }),
        [debouncedSearch, state.pageSize, token],
    )

    const page = state.page

    const { data, isFetching, error, refetch } = useGetApplicationsQuery(params)

    useEffect(() => {
        if (!data) return

        dispatch({ type: "PAGE_LOADED", page, nextToken: data.next_token })
    }, [data, page])

    const paginationModel = useMemo<GridPaginationModel>(
        () => ({ page: state.page, pageSize: state.pageSize }),
        [state.page, state.pageSize],
    )

    const setSearch = useCallback((value: string) => dispatch({ type: "SET_SEARCH", value }), [])

    const handlePaginationModelChange = useCallback(
        ({ page: nextPage, pageSize: nextPageSize }: GridPaginationModel) =>
            dispatch({ type: "SET_PAGINATION", page: nextPage, pageSize: nextPageSize }),
        [],
    )

    return {
        rows: data?.items ?? EMPTY_ROWS,
        rowCount: data?.total ?? EMPTY_TOTAL,
        isLoading: isFetching,
        error: getErrorMessage(error),
        search: state.search,
        paginationModel,
        setSearch,
        handlePaginationModelChange,
        retry: refetch,
    }
}
