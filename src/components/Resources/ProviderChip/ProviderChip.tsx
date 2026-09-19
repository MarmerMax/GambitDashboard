import { PROVIDER_COLOR } from "@src/theme"
import type { Provider } from "@src/types"
import { StatusChip } from "@src/components/common"

export interface ProviderChipPropsType {
    provider: Provider
}

export const ProviderChip = ({ provider }: ProviderChipPropsType) => (
    <StatusChip label={provider} color={PROVIDER_COLOR[provider]} />
)
