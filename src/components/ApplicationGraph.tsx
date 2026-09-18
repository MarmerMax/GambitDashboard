import { useMemo } from 'react'
import type { Application, Resource } from '../types'

interface ApplicationGraphProps {
    application: Application
    resources: Resource[]
}

const VIEW_WIDTH = 900
const VIEW_HEIGHT = 520
const CENTER_X = 450
const CENTER_Y = 260
const RADIUS_X = 300
const RADIUS_Y = 180
const NODE_WIDTH = 176
const NODE_HEIGHT = 58
const APP_WIDTH = 208
const APP_HEIGHT = 72
const START_ANGLE = -Math.PI / 2
const FULL_TURN = Math.PI * 2
const MAX_LABEL_LENGTH = 22

const truncate = (value: string) =>
    value.length > MAX_LABEL_LENGTH ? `${value.slice(0, MAX_LABEL_LENGTH - 1)}…` : value

export const ApplicationGraph = ({ application, resources }: ApplicationGraphProps) => {
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
        <svg
            className="graph"
            viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
            role="img"
            aria-label={`${application.name} connected to ${resources.length} resources`}
        >
            {nodes.map(({ resource, x, y }) => (
                <line className="graph__edge" key={`edge-${resource.id}`} x1={CENTER_X} y1={CENTER_Y} x2={x} y2={y} />
            ))}

            <g className="graph-app">
                <rect
                    x={CENTER_X - APP_WIDTH / 2}
                    y={CENTER_Y - APP_HEIGHT / 2}
                    width={APP_WIDTH}
                    height={APP_HEIGHT}
                    rx={14}
                />
                <text className="graph-app__name" x={CENTER_X} y={CENTER_Y - 6} textAnchor="middle">
                    {truncate(application.name)}
                </text>
                <text className="graph-app__meta" x={CENTER_X} y={CENTER_Y + 16} textAnchor="middle">
                    {resources.length} resource{resources.length === 1 ? '' : 's'}
                </text>
            </g>

            {nodes.map(({ resource, x, y }) => (
                <g className="graph-node" key={resource.id}>
                    <title>
                        {`${resource.name} · ${resource.type} · ${resource.provider} ${resource.region} · ${resource.environment} · ${resource.criticality} · ${resource.openIssues} open issues`}
                    </title>
                    <rect
                        className="graph-node__card"
                        x={x - NODE_WIDTH / 2}
                        y={y - NODE_HEIGHT / 2}
                        width={NODE_WIDTH}
                        height={NODE_HEIGHT}
                        rx={12}
                    />
                    <rect
                        className={`graph-node__accent graph-node__accent--${resource.criticality}`}
                        x={x - NODE_WIDTH / 2}
                        y={y - NODE_HEIGHT / 2 + 10}
                        width={4}
                        height={NODE_HEIGHT - 20}
                        rx={2}
                    />
                    <text className="graph-node__name" x={x - NODE_WIDTH / 2 + 16} y={y - 4}>
                        {truncate(resource.name)}
                    </text>
                    <text className="graph-node__meta" x={x - NODE_WIDTH / 2 + 16} y={y + 14}>
                        {resource.provider} · {truncate(resource.type)}
                    </text>
                </g>
            ))}
        </svg>
    )
}
