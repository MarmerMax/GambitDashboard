import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from "react"
import { useCallback } from "react"
import { CRITICALITY_COLOR } from "@src/theme"
import type { Resource } from "@src/types"

export interface ApplicationGraphNodePropsType {
    resource: Resource
    x: number
    y: number
    isSelected: boolean
    onSelect: (id: string) => void
}

const COLLAPSED_WIDTH = 176
const COLLAPSED_HEIGHT = 58
const EXPANDED_WIDTH = 264
const EXPANDED_HEIGHT = 200
const ACCENT_WIDTH = 4
const ACCENT_INSET = 10
const LABEL_OFFSET = 16
const MAX_LABEL_LENGTH = 22
const MAX_VALUE_LENGTH = 28

const COLLAPSED_ROWS = { name: -4, meta: 14 }
const EXPANDED_ROWS = {
    name: 26,
    meta: 46,
    type: 76,
    environment: 96,
    criticality: 116,
    owner: 136,
    issues: 156,
    tags: 180,
}

const truncate = (value: string, maxLength = MAX_LABEL_LENGTH) =>
    value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value

export const ApplicationGraphNode = ({
    resource,
    x,
    y,
    isSelected,
    onSelect,
}: ApplicationGraphNodePropsType) => {
    const handleSelect = useCallback(() => onSelect(resource.id), [onSelect, resource.id])

    const handlePointerDown = useCallback(
        (event: ReactPointerEvent<SVGGElement>) => event.stopPropagation(),
        [],
    )

    const handleKeyDown = useCallback(
        (event: ReactKeyboardEvent<SVGGElement>) => {
            if (event.key !== "Enter" && event.key !== " ") return

            event.preventDefault()
            onSelect(resource.id)
        },
        [onSelect, resource.id],
    )

    const width = isSelected ? EXPANDED_WIDTH : COLLAPSED_WIDTH
    const height = isSelected ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT
    const left = x - width / 2
    const top = y - height / 2
    const labelX = left + LABEL_OFFSET

    return (
        <g
            className={isSelected ? "graph-node graph-node--selected" : "graph-node"}
            role="button"
            tabIndex={0}
            aria-pressed={isSelected}
            aria-label={`Show details of ${resource.name}`}
            onPointerDown={handlePointerDown}
            onClick={handleSelect}
            onKeyDown={handleKeyDown}
        >
            <title>
                {`${resource.name} · ${resource.type} · ${resource.provider} ${resource.region}`}
            </title>

            <rect
                className="graph-node-card"
                x={left}
                y={top}
                width={width}
                height={height}
                rx={12}
            />
            <rect
                x={left}
                y={top + ACCENT_INSET}
                width={ACCENT_WIDTH}
                height={height - ACCENT_INSET * 2}
                rx={2}
                fill={CRITICALITY_COLOR[resource.criticality]}
            />

            {isSelected ? (
                <>
                    <text className="graph-node-name" x={labelX} y={top + EXPANDED_ROWS.name}>
                        {truncate(resource.name, MAX_VALUE_LENGTH)}
                    </text>
                    <text className="graph-node-meta" x={labelX} y={top + EXPANDED_ROWS.meta}>
                        {resource.provider} · {resource.region}
                    </text>
                    <text className="graph-node-field" x={labelX} y={top + EXPANDED_ROWS.type}>
                        Type: {truncate(resource.type, MAX_VALUE_LENGTH)}
                    </text>
                    <text
                        className="graph-node-field"
                        x={labelX}
                        y={top + EXPANDED_ROWS.environment}
                    >
                        Environment: {resource.environment}
                    </text>
                    <text
                        className="graph-node-field"
                        x={labelX}
                        y={top + EXPANDED_ROWS.criticality}
                    >
                        Criticality: {resource.criticality}
                    </text>
                    <text className="graph-node-field" x={labelX} y={top + EXPANDED_ROWS.owner}>
                        Owner: {truncate(resource.owner, MAX_VALUE_LENGTH)}
                    </text>
                    <text className="graph-node-field" x={labelX} y={top + EXPANDED_ROWS.issues}>
                        Open issues: {resource.openIssues}
                    </text>
                    <text className="graph-node-tags" x={labelX} y={top + EXPANDED_ROWS.tags}>
                        {truncate(resource.tags.join(" · "), MAX_VALUE_LENGTH)}
                    </text>
                </>
            ) : (
                <>
                    <text className="graph-node-name" x={labelX} y={y + COLLAPSED_ROWS.name}>
                        {truncate(resource.name)}
                    </text>
                    <text className="graph-node-meta" x={labelX} y={y + COLLAPSED_ROWS.meta}>
                        {resource.provider} · {truncate(resource.type)}
                    </text>
                </>
            )}
        </g>
    )
}
