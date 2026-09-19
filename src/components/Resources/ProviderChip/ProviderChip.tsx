import { PROVIDER_COLOR } from "@src/theme/statusColors"
import type { Provider } from "@src/types"
import { StatusChip } from "@src/components/common/StatusChip"

export interface ProviderChipPropsType {
    provider: Provider
}

export const ProviderChip = ({ provider }: ProviderChipPropsType) => (
    <StatusChip label={provider} color={PROVIDER_COLOR[provider]} />
)
