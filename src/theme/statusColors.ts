import type { Criticality, Environment, Provider } from "@src/types"

export const PROVIDER_COLOR: Record<Provider, string> = {
    AWS: "#d9821a",
    GCP: "#2563eb",
    Azure: "#0a7ea4",
}

export const ENVIRONMENT_COLOR: Record<Environment, string> = {
    production: "#c0392b",
    staging: "#b7791f",
    development: "#2f855a",
}

export const CRITICALITY_COLOR: Record<Criticality, string> = {
    critical: "#d64545",
    high: "#e07a1f",
    medium: "#c9a227",
    low: "#7b869c",
}
