import type { Application } from "@src/types"

export const SEEDED_APPLICATIONS: Application[] = [
    {
        id: "app-0001",
        name: "Checkout Platform",
        description: "Customer-facing checkout and payment flow",
        resourceIds: ["res-0001", "res-0003", "res-0004", "res-0187", "res-0201"],
    },
    {
        id: "app-0002",
        name: "Identity & Access",
        description: "Authentication, IAM roles and secret storage",
        resourceIds: ["res-0005", "res-0010", "res-0143"],
    },
    {
        id: "app-0003",
        name: "Analytics Pipeline",
        resourceIds: ["res-0007", "res-0099", "res-0120", "res-0233"],
    },
]
