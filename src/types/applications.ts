export interface Application {
    id: string
    name: string
    description?: string
    resourceIds: string[]
}

export interface ApplicationDraft {
    name: string
    description: string
    resourceIds: string[]
}
