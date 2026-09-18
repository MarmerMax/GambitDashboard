export type Provider = 'AWS' | 'GCP' | 'Azure'

export type Environment = 'production' | 'staging' | 'development'

export type Criticality = 'low' | 'medium' | 'high' | 'critical'

export interface Resource {
    id: string
    name: string
    type: string
    provider: Provider
    region: string
    environment: Environment
    criticality: Criticality
    owner: string
    tags: string[]
    openIssues: number
}

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

export type FilterValue<T extends string> = T | 'all'

export interface ResourceFilters {
    search: string
    provider: FilterValue<Provider>
    environment: FilterValue<Environment>
    criticality: FilterValue<Criticality>
}

export const PROVIDERS: readonly Provider[] = ['AWS', 'GCP', 'Azure']

export const ENVIRONMENTS: readonly Environment[] = ['production', 'staging', 'development']

export const CRITICALITIES: readonly Criticality[] = ['critical', 'high', 'medium', 'low']
