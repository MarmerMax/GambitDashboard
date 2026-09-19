import type { GridPaginationModel } from "@mui/x-data-grid"
import { useCallback, useEffect, useMemo, useReducer, useState } from "react"
import type { FetchApplicationsParams } from "@src/api/Applications/applicationsApi"
import type { Application } from "@src/types"
import { fetchApplicationsPage } from "@src/state/Applications/applicationsSlice"
import { useAppDispatch, useAppSelector } from "@src/state/hooks"
import { useDebouncedValue } from "@src/hooks/common/useDebouncedValue"

const DEFAULT_PAGE_SIZE = 25
const SEARCH_DEBOUNCE_MS = 350
const FIRST_PAGE = 0
const INITIAL_TOKENS: TokensByPage = { [FIRST_PAGE]: undefined }

type TokensByPage = Record<number, string | undefined>

interface TableStateType {
    search: string
    page: number
    pageSize: number
    tokens: TokensByPage
}

type TableActionType =
    | { type: "SET_SEARCH"; value: string }
    | { type: "SET_PAGINATION"; page: number; pageSize: number }
    | { type: "PAGE_LOADED"; page: number; nextToken?: string }

const INITIAL_STATE: TableStateType = {
    search: "",
    page: FIRST_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    tokens: INITIAL_TOKENS,
}

const tableReducer = (state: TableStateType, action: TableActionType): TableStateType => {
    switch (action.type) {
        case "SET_SEARCH":
            return { ...state, search: action.value, page: FIRST_PAGE, tokens: INITIAL_TOKENS }
        case "SET_PAGINATION":
            return action.pageSize === state.pageSize
                ? { ...state, page: action.page }
                : { ...state, page: FIRST_PAGE, pageSize: action.pageSize, tokens: INITIAL_TOKENS }
        case "PAGE_LOADED":
            return { ...state, tokens: { ...state.tokens, [action.page + 1]: action.nextToken } }
    }
}

export const useApplicationsTable = () => {
    const [state, dispatch] = useReducer(tableReducer, INITIAL_STATE)
    const [reloadKey, setReloadKey] = useState(0)

    const appDispatch = useAppDispatch()
    const {
        ids,
        total: rowCount,
        isLoading,
        error,
    } = useAppSelector((store) => store.applications.list)
    const entities = useAppSelector((store) => store.applications.entities)

    const rows = useMemo(
        () =>
            ids
                .map((id) => entities[id])
                .filter((application): application is Application => Boolean(application)),
        [ids, entities],
    )

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
    const pageSize = state.pageSize

    useEffect(() => {
        if (page > FIRST_PAGE && params.next_token === undefined) {
            dispatch({ type: "SET_PAGINATION", page: FIRST_PAGE, pageSize })

            return
        }

        const request = appDispatch(fetchApplicationsPage(params))

        request
            .unwrap()
            .then((response) =>
                dispatch({ type: "PAGE_LOADED", page, nextToken: response.next_token }),
            )
            .catch(() => undefined)

        return () => request.abort()
    }, [appDispatch, params, page, pageSize, reloadKey])

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

    const retry = useCallback(() => setReloadKey((current) => current + 1), [])

    return {
        rows,
        rowCount,
        isLoading,
        error,
        search: state.search,
        paginationModel,
        setSearch,
        handlePaginationModelChange,
        retry,
    }
}
