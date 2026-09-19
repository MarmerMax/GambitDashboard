import type { GridPaginationModel, GridSortModel } from "@mui/x-data-grid"
import { useCallback, useEffect, useMemo, useReducer, useState } from "react"
import type { FetchResourcesParams } from "@src/api/Resources/resourcesApi"
import type { Criticality, Environment, Provider, Resource } from "@src/types"
import { useDebouncedValue } from "@src/hooks/common/useDebouncedValue"
import { useAppDispatch, useAppSelector } from "@src/state/hooks"
import { fetchResourcesPage } from "@src/state/Resources/resourcesSlice"
import { INITIAL_STATE, TABLE_ACTION_TYPE, tableReducer } from "./tableReducer"
import { FIRST_PAGE, isSortableField, SEARCH_DEBOUNCE_MS } from "./utils"

export const useResourcesTable = () => {
    const [state, dispatch] = useReducer(tableReducer, INITIAL_STATE)
    const [reloadKey, setReloadKey] = useState(0)

    const appDispatch = useAppDispatch()
    const {
        ids,
        total: rowCount,
        isLoading,
        error,
    } = useAppSelector((store) => store.resources.list)
    const entities = useAppSelector((store) => store.resources.entities)

    const rows = useMemo(
        () =>
            ids
                .map((id) => entities[id])
                .filter((resource): resource is Resource => Boolean(resource)),
        [ids, entities],
    )

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
    const pageSize = state.pageSize

    useEffect(() => {
        if (page > FIRST_PAGE && params.next_token === undefined) {
            dispatch({ type: TABLE_ACTION_TYPE.SET_PAGINATION, page: FIRST_PAGE, pageSize })

            return
        }

        const request = appDispatch(fetchResourcesPage(params))

        request
            .unwrap()
            .then((response) =>
                dispatch({
                    type: TABLE_ACTION_TYPE.PAGE_LOADED,
                    page,
                    nextToken: response.next_token,
                }),
            )
            .catch(() => undefined)

        return () => request.abort()
    }, [appDispatch, params, page, pageSize, reloadKey])

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
        ({ page: nextPage, pageSize }: GridPaginationModel) =>
            dispatch({ type: TABLE_ACTION_TYPE.SET_PAGINATION, page: nextPage, pageSize }),
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

    const retry = useCallback(() => setReloadKey((current) => current + 1), [])

    const hasActiveFilters = useMemo(
        () =>
            state.filters.search !== "" ||
            Boolean(state.filters.provider) ||
            Boolean(state.filters.environment) ||
            Boolean(state.filters.criticality),
        [state.filters],
    )

    return {
        rows,
        rowCount,
        isLoading,
        error,
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
        retry,
    }
}
