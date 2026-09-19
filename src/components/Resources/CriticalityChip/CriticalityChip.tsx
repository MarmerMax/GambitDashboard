import { CRITICALITY_COLOR } from "@src/theme/statusColors"
import type { Criticality } from "@src/types"
import { StatusChip } from "@src/components/common/StatusChip"

export interface CriticalityChipPropsType {
    criticality: Criticality
}

export const CriticalityChip = ({ criticality }: CriticalityChipPropsType) => (
    <StatusChip label={criticality} color={CRITICALITY_COLOR[criticality]} />
)
