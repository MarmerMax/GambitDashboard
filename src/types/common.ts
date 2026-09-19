export type SortDirection = "asc" | "desc"

export interface CursorPage<Item> {
    items: Item[]
    next_token?: string
    total: number
}
