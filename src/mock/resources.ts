import type { Criticality, Environment, Provider, Resource } from "@src/types"

const CURATED_RESOURCES: Resource[] = [
    {
        id: "res-0001",
        name: "prod-web-api-01",
        type: "EC2 Instance",
        provider: "AWS",
        region: "us-east-1",
        environment: "production",
        criticality: "critical",
        owner: "Maya Cohen",
        tags: ["public-facing", "tier-1"],
        openIssues: 7,
    },
    {
        id: "res-0002",
        name: "customer-assets",
        type: "S3 Bucket",
        provider: "AWS",
        region: "us-east-1",
        environment: "production",
        criticality: "high",
        owner: "Maya Cohen",
        tags: ["storage", "pii"],
        openIssues: 3,
    },
    {
        id: "res-0003",
        name: "orders-db-primary",
        type: "PostgreSQL Database",
        provider: "GCP",
        region: "europe-west1",
        environment: "production",
        criticality: "critical",
        owner: "Daniel Ross",
        tags: ["database", "pii", "tier-1"],
        openIssues: 5,
    },
    {
        id: "res-0004",
        name: "checkout-cluster",
        type: "Kubernetes Cluster",
        provider: "GCP",
        region: "europe-west1",
        environment: "production",
        criticality: "high",
        owner: "Daniel Ross",
        tags: ["k8s", "tier-1"],
        openIssues: 2,
    },
    {
        id: "res-0005",
        name: "ci-deployer-role",
        type: "IAM Role",
        provider: "AWS",
        region: "global",
        environment: "production",
        criticality: "critical",
        owner: "Noa Levi",
        tags: ["iam", "automation"],
        openIssues: 4,
    },
    {
        id: "res-0006",
        name: "staging-web-api",
        type: "EC2 Instance",
        provider: "AWS",
        region: "us-west-2",
        environment: "staging",
        criticality: "medium",
        owner: "Maya Cohen",
        tags: ["staging"],
        openIssues: 1,
    },
    {
        id: "res-0007",
        name: "analytics-warehouse",
        type: "BigQuery Dataset",
        provider: "GCP",
        region: "us-central1",
        environment: "staging",
        criticality: "medium",
        owner: "Ido Peretz",
        tags: ["analytics"],
        openIssues: 0,
    },
    {
        id: "res-0008",
        name: "billing-functions",
        type: "Function App",
        provider: "Azure",
        region: "westeurope",
        environment: "production",
        criticality: "high",
        owner: "Ido Peretz",
        tags: ["serverless", "billing"],
        openIssues: 6,
    },
    {
        id: "res-0009",
        name: "dev-sandbox-vm",
        type: "Virtual Machine",
        provider: "Azure",
        region: "eastus",
        environment: "development",
        criticality: "low",
        owner: "Noa Levi",
        tags: ["sandbox"],
        openIssues: 0,
    },
    {
        id: "res-0010",
        name: "secrets-vault",
        type: "Key Vault",
        provider: "Azure",
        region: "westeurope",
        environment: "production",
        criticality: "critical",
        owner: "Noa Levi",
        tags: ["secrets", "tier-1"],
        openIssues: 2,
    },
]

const GENERATED_COUNT = 230
const SEED = 1337
const LCG_MULTIPLIER = 1664525
const LCG_INCREMENT = 1013904223
const LCG_MODULUS = 2 ** 32

const SERVICES = [
    "orders",
    "checkout",
    "inventory",
    "billing",
    "identity",
    "search",
    "notifications",
    "analytics",
    "gateway",
    "reporting",
    "fraud",
    "catalog",
    "shipping",
    "support",
]

const TYPES_BY_PROVIDER: Record<Provider, string[]> = {
    AWS: [
        "EC2 Instance",
        "S3 Bucket",
        "IAM Role",
        "Lambda Function",
        "RDS Database",
        "EKS Cluster",
    ],
    GCP: [
        "Compute Instance",
        "Cloud Storage Bucket",
        "PostgreSQL Database",
        "BigQuery Dataset",
        "GKE Cluster",
    ],
    Azure: [
        "Virtual Machine",
        "Blob Container",
        "Key Vault",
        "Function App",
        "AKS Cluster",
        "SQL Database",
    ],
}

const REGIONS_BY_PROVIDER: Record<Provider, string[]> = {
    AWS: ["us-east-1", "us-west-2", "eu-west-1", "ap-southeast-1"],
    GCP: ["europe-west1", "us-central1", "asia-east1"],
    Azure: ["westeurope", "eastus", "northeurope"],
}

const OWNERS = ["Maya Cohen", "Daniel Ross", "Noa Levi", "Ido Peretz", "Sara Abadi", "Tom Werner"]

const PROVIDER_VALUES: Provider[] = ["AWS", "GCP", "Azure"]
const ENVIRONMENT_VALUES: Environment[] = ["production", "staging", "development"]
const CRITICALITY_VALUES: Criticality[] = ["critical", "high", "medium", "low"]
const TAG_POOL = [
    "tier-1",
    "pii",
    "public-facing",
    "internal",
    "automation",
    "k8s",
    "storage",
    "legacy",
    "gdpr",
]

const MAX_ISSUES_BY_CRITICALITY: Record<Criticality, number> = {
    critical: 9,
    high: 6,
    medium: 4,
    low: 2,
}

const createRandom = (seed: number) => {
    let state = seed

    return () => {
        state = (state * LCG_MULTIPLIER + LCG_INCREMENT) % LCG_MODULUS

        return state / LCG_MODULUS
    }
}

const pick = <Item>(items: readonly Item[], random: number) =>
    items[Math.floor(random * items.length)] as Item

const generateResources = () => {
    const random = createRandom(SEED)

    return Array.from({ length: GENERATED_COUNT }, (_unused, index) => {
        const provider = pick(PROVIDER_VALUES, random())
        const environment = pick(ENVIRONMENT_VALUES, random())
        const criticality = pick(CRITICALITY_VALUES, random())
        const service = pick(SERVICES, random())
        const type = pick(TYPES_BY_PROVIDER[provider], random())
        const sequence = String(index + 1).padStart(3, "0")
        const tagCount = 1 + Math.floor(random() * 2)
        const tags = Array.from({ length: tagCount }, () => pick(TAG_POOL, random()))

        return {
            id: `res-${String(CURATED_RESOURCES.length + index + 1).padStart(4, "0")}`,
            name: `${environment.slice(0, 4)}-${service}-${sequence}`,
            type,
            provider,
            region: pick(REGIONS_BY_PROVIDER[provider], random()),
            environment,
            criticality,
            owner: pick(OWNERS, random()),
            tags: [...new Set(tags)],
            openIssues: Math.floor(random() * (MAX_ISSUES_BY_CRITICALITY[criticality] + 1)),
        } satisfies Resource
    })
}

export const RESOURCES: Resource[] = [...CURATED_RESOURCES, ...generateResources()]
