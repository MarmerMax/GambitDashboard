export type Provider = "AWS" | "GCP" | "Azure"

export type Environment = "production" | "staging" | "development"

export type Criticality = "low" | "medium" | "high" | "critical"

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

export type ResourceSortField = keyof Pick<
    Resource,
    "name" | "type" | "provider" | "environment" | "criticality" | "owner" | "region" | "openIssues"
>

export interface ResourceFilters {
    search: string
    provider?: Provider
    environment?: Environment
    criticality?: Criticality
}

export const PROVIDERS: readonly Provider[] = ["AWS", "GCP", "Azure"]

export const ENVIRONMENTS: readonly Environment[] = ["production", "staging", "development"]

export const CRITICALITIES: readonly Criticality[] = ["critical", "high", "medium", "low"]

export const EMPTY_FILTERS: ResourceFilters = { search: "" }
