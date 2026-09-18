import type { Criticality, Environment, Provider } from '../types'

export type BadgeTone = Provider | Environment | Criticality

interface BadgeProps {
    tone: BadgeTone
}

export const Badge = ({ tone }: BadgeProps) => (
    <span className={`badge badge--${tone.toLowerCase()}`}>{tone}</span>
)
