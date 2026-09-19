export type SortDirection = "asc" | "desc"

export type TokensByPage = Record<number, string | undefined>

export interface CursorPage<Item> {
    items: Item[]
    next_token?: string
    total: number
}
