import { ENVIRONMENT_COLOR } from "@src/theme/statusColors"
import type { Environment } from "@src/types"
import { StatusChip } from "@src/components/common/StatusChip"

export interface EnvironmentChipPropsType {
    environment: Environment
}

export const EnvironmentChip = ({ environment }: EnvironmentChipPropsType) => (
    <StatusChip label={environment} color={ENVIRONMENT_COLOR[environment]} />
)
