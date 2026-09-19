import Box from "@mui/material/Box"
import { useMemo } from "react"
import { CRITICALITY_COLOR } from "@src/theme/statusColors"
import type { Application, Resource } from "@src/types"

export interface ApplicationGraphPropsType {
    application: Application
    resources: Resource[]
    height?: number | string
}

const VIEW_WIDTH = 900
const VIEW_HEIGHT = 500
const CENTER_X = 450
const CENTER_Y = 250
const RADIUS_X = 300
const RADIUS_Y = 172
const NODE_WIDTH = 176
const NODE_HEIGHT = 58
const APP_WIDTH = 208
const APP_HEIGHT = 72
const START_ANGLE = -Math.PI / 2
const FULL_TURN = Math.PI * 2
const MAX_LABEL_LENGTH = 22
const ACCENT_WIDTH = 4
const ACCENT_INSET = 10
const DEFAULT_HEIGHT = 380

const truncate = (value: string) =>
    value.length > MAX_LABEL_LENGTH ? `${value.slice(0, MAX_LABEL_LENGTH - 1)}…` : value

export const ApplicationGraph = ({
    application,
    resources,
    height = DEFAULT_HEIGHT,
}: ApplicationGraphPropsType) => {
    const nodes = useMemo(
        () =>
            resources.map((resource, index) => {
                const angle = START_ANGLE + (index * FULL_TURN) / resources.length

                return {
                    resource,
                    x: CENTER_X + RADIUS_X * Math.cos(angle),
                    y: CENTER_Y + RADIUS_Y * Math.sin(angle),
                }
            }),
        [resources],
    )

    return (
        <Box
            component="svg"
            viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
            role="img"
            aria-label={`${application.name} connected to ${resources.length} resources`}
            sx={(theme) => ({
                display: "block",
                width: "100%",
                height,
                borderRadius: 1,
                backgroundColor: theme.palette.background.default,
                "& .graph-edge": {
                    stroke: theme.palette.divider,
                    strokeWidth: 1.5,
                    strokeDasharray: "5 5",
                },
                "& .graph-node-card": {
                    fill: theme.palette.background.paper,
                    stroke: theme.palette.divider,
                    transition: theme.transitions.create("stroke"),
                },
                "& .graph-node:hover .graph-node-card": { stroke: theme.palette.primary.main },
                "& .graph-node-name": {
                    fill: theme.palette.text.primary,
                    fontSize: 13,
                    fontWeight: 600,
                },
                "& .graph-node-meta": { fill: theme.palette.text.secondary, fontSize: 11 },
                "& .graph-app-card": { fill: theme.palette.primary.main },
                "& .graph-app-name": {
                    fill: theme.palette.primary.contrastText,
                    fontSize: 16,
                    fontWeight: 650,
                },
                "& .graph-app-meta": {
                    fill: theme.palette.primary.contrastText,
                    fontSize: 12,
                    opacity: 0.8,
                },
            })}
        >
            {nodes.map(({ resource, x, y }) => (
                <line
                    className="graph-edge"
                    key={`edge-${resource.id}`}
                    x1={CENTER_X}
                    y1={CENTER_Y}
                    x2={x}
                    y2={y}
                />
            ))}

            <g>
                <rect
                    className="graph-app-card"
                    x={CENTER_X - APP_WIDTH / 2}
                    y={CENTER_Y - APP_HEIGHT / 2}
                    width={APP_WIDTH}
                    height={APP_HEIGHT}
                    rx={14}
                />
                <text className="graph-app-name" x={CENTER_X} y={CENTER_Y - 6} textAnchor="middle">
                    {truncate(application.name)}
                </text>
                <text className="graph-app-meta" x={CENTER_X} y={CENTER_Y + 16} textAnchor="middle">
                    {resources.length} resource{resources.length === 1 ? "" : "s"}
                </text>
            </g>

            {nodes.map(({ resource, x, y }) => (
                <g className="graph-node" key={resource.id}>
                    <title>
                        {`${resource.name} · ${resource.type} · ${resource.provider} ${resource.region} · ${resource.environment} · ${resource.criticality} · ${resource.openIssues} open issues`}
                    </title>
                    <rect
                        className="graph-node-card"
                        x={x - NODE_WIDTH / 2}
                        y={y - NODE_HEIGHT / 2}
                        width={NODE_WIDTH}
                        height={NODE_HEIGHT}
                        rx={12}
                    />
                    <rect
                        x={x - NODE_WIDTH / 2}
                        y={y - NODE_HEIGHT / 2 + ACCENT_INSET}
                        width={ACCENT_WIDTH}
                        height={NODE_HEIGHT - ACCENT_INSET * 2}
                        rx={2}
                        fill={CRITICALITY_COLOR[resource.criticality]}
                    />
                    <text className="graph-node-name" x={x - NODE_WIDTH / 2 + 16} y={y - 4}>
                        {truncate(resource.name)}
                    </text>
                    <text className="graph-node-meta" x={x - NODE_WIDTH / 2 + 16} y={y + 14}>
                        {resource.provider} · {truncate(resource.type)}
                    </text>
                </g>
            ))}
        </Box>
    )
}
