import CenterFocusStrongIcon from "@mui/icons-material/CenterFocusStrong"
import ZoomInIcon from "@mui/icons-material/ZoomIn"
import ZoomOutIcon from "@mui/icons-material/ZoomOut"
import { Box, IconButton, Paper, Stack, Tooltip } from "@mui/material"
import type { PointerEvent as ReactPointerEvent } from "react"
import { useCallback, useMemo, useRef, useState } from "react"
import type { Application, Resource } from "@src/types"
import { ApplicationGraphNode } from "./ApplicationGraphNode"

export interface ApplicationGraphPropsType {
    application: Application
    resources: Resource[]
    selectedResourceId?: string
    onSelectResource: (id: string) => void
}

const VIEW_WIDTH = 900
const VIEW_HEIGHT = 500
const CENTER_X = 450
const CENTER_Y = 250
const RADIUS_X = 300
const RADIUS_Y = 172
const APP_WIDTH = 208
const APP_HEIGHT = 72
const START_ANGLE = -Math.PI / 2
const FULL_TURN = Math.PI * 2
const MAX_LABEL_LENGTH = 22

const MIN_ZOOM = 0.5
const MAX_ZOOM = 4
const ZOOM_FACTOR = 1.25
const DRAG_THRESHOLD_PX = 4
const INITIAL_VIEW = { zoom: 1, x: 0, y: 0 }

interface DragStateType {
    pointerX: number
    pointerY: number
    viewX: number
    viewY: number
    zoom: number
    hasMoved: boolean
}

const truncate = (value: string) =>
    value.length > MAX_LABEL_LENGTH ? `${value.slice(0, MAX_LABEL_LENGTH - 1)}…` : value

const clampZoom = (zoom: number) => Math.min(Math.max(zoom, MIN_ZOOM), MAX_ZOOM)

export const ApplicationGraph = ({
    application,
    resources,
    selectedResourceId,
    onSelectResource,
}: ApplicationGraphPropsType) => {
    const [view, setView] = useState(INITIAL_VIEW)

    const svgRef = useRef<SVGSVGElement>(null)
    const dragRef = useRef<DragStateType | null>(null)

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

    const orderedNodes = useMemo(
        () =>
            [...nodes].sort(
                (left, right) =>
                    Number(left.resource.id === selectedResourceId) -
                    Number(right.resource.id === selectedResourceId),
            ),
        [nodes, selectedResourceId],
    )

    const zoomBy = useCallback((factor: number) => {
        setView((current) => {
            const zoom = clampZoom(current.zoom * factor)
            const width = VIEW_WIDTH / current.zoom
            const height = VIEW_HEIGHT / current.zoom
            const nextWidth = VIEW_WIDTH / zoom
            const nextHeight = VIEW_HEIGHT / zoom

            return {
                zoom,
                x: current.x + (width - nextWidth) / 2,
                y: current.y + (height - nextHeight) / 2,
            }
        })
    }, [])

    const handleZoomIn = useCallback(() => zoomBy(ZOOM_FACTOR), [zoomBy])

    const handleZoomOut = useCallback(() => zoomBy(1 / ZOOM_FACTOR), [zoomBy])

    const handleResetView = useCallback(() => setView(INITIAL_VIEW), [])

    const handlePointerDown = useCallback((event: ReactPointerEvent<SVGSVGElement>) => {
        setView((current) => {
            dragRef.current = {
                pointerX: event.clientX,
                pointerY: event.clientY,
                viewX: current.x,
                viewY: current.y,
                zoom: current.zoom,
                hasMoved: false,
            }

            return current
        })
    }, [])

    const handlePointerMove = useCallback((event: ReactPointerEvent<SVGSVGElement>) => {
        const drag = dragRef.current
        const svgWidth = svgRef.current?.clientWidth

        if (!drag || !svgWidth) return

        const pointerDeltaX = event.clientX - drag.pointerX
        const pointerDeltaY = event.clientY - drag.pointerY

        if (!drag.hasMoved) {
            if (Math.abs(pointerDeltaX) + Math.abs(pointerDeltaY) <= DRAG_THRESHOLD_PX) return

            drag.hasMoved = true
            svgRef.current?.setPointerCapture(event.pointerId)
        }

        const scale = VIEW_WIDTH / drag.zoom / svgWidth

        setView((current) => ({
            ...current,
            x: drag.viewX - pointerDeltaX * scale,
            y: drag.viewY - pointerDeltaY * scale,
        }))
    }, [])

    const handlePointerUp = useCallback((event: ReactPointerEvent<SVGSVGElement>) => {
        if (svgRef.current?.hasPointerCapture(event.pointerId)) {
            svgRef.current.releasePointerCapture(event.pointerId)
        }

        dragRef.current = null
    }, [])

    const viewBox = `${view.x} ${view.y} ${VIEW_WIDTH / view.zoom} ${VIEW_HEIGHT / view.zoom}`

    return (
        <Paper sx={{ position: "relative", overflow: "hidden", flex: 1, minHeight: 0 }}>
            <Box
                component="svg"
                ref={svgRef}
                viewBox={viewBox}
                role="img"
                aria-label={`${application.name} connected to ${resources.length} resources`}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                sx={(theme) => ({
                    display: "block",
                    width: "100%",
                    height: "100%",
                    touchAction: "none",
                    cursor: "grab",
                    "&:active": { cursor: "grabbing" },
                    backgroundColor: theme.palette.background.default,
                    "& .graph-edge": {
                        stroke: theme.palette.divider,
                        strokeWidth: 1.5,
                        strokeDasharray: "5 5",
                    },
                    "& .graph-node": { cursor: "pointer", outline: "none" },
                    "& .graph-node:focus-visible .graph-node-card": {
                        stroke: theme.palette.primary.main,
                        strokeWidth: 2,
                        strokeDasharray: "4 3",
                    },
                    "& .graph-node-card": {
                        fill: theme.palette.background.paper,
                        stroke: theme.palette.divider,
                        transition: theme.transitions.create("stroke"),
                    },
                    "& .graph-node:hover .graph-node-card": { stroke: theme.palette.primary.main },
                    "& .graph-node--selected .graph-node-card": {
                        stroke: theme.palette.primary.main,
                        strokeWidth: 2,
                        filter: `drop-shadow(0 6px 16px ${theme.palette.action.disabled})`,
                    },
                    "& .graph-node-name": {
                        fill: theme.palette.text.primary,
                        fontSize: 13,
                        fontWeight: 600,
                    },
                    "& .graph-node-meta": { fill: theme.palette.text.secondary, fontSize: 11 },
                    "& .graph-node-field": { fill: theme.palette.text.primary, fontSize: 12 },
                    "& .graph-node-tags": {
                        fill: theme.palette.text.secondary,
                        fontSize: 11,
                        fontStyle: "italic",
                    },
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
                    <text
                        className="graph-app-name"
                        x={CENTER_X}
                        y={CENTER_Y - 6}
                        textAnchor="middle"
                    >
                        {truncate(application.name)}
                    </text>
                    <text
                        className="graph-app-meta"
                        x={CENTER_X}
                        y={CENTER_Y + 16}
                        textAnchor="middle"
                    >
                        {resources.length} resource{resources.length === 1 ? "" : "s"}
                    </text>
                </g>

                {orderedNodes.map(({ resource, x, y }) => (
                    <ApplicationGraphNode
                        key={resource.id}
                        resource={resource}
                        x={x}
                        y={y}
                        isSelected={resource.id === selectedResourceId}
                        onSelect={onSelectResource}
                    />
                ))}
            </Box>

            <Stack
                spacing={0.5}
                sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    p: 0.5,
                    borderRadius: 1,
                    backgroundColor: "background.paper",
                    border: 1,
                    borderColor: "divider",
                }}
            >
                <Tooltip title="Zoom in" placement="left">
                    <span>
                        <IconButton
                            size="small"
                            aria-label="Zoom in"
                            onClick={handleZoomIn}
                            disabled={view.zoom >= MAX_ZOOM}
                        >
                            <ZoomInIcon fontSize="small" />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Zoom out" placement="left">
                    <span>
                        <IconButton
                            size="small"
                            aria-label="Zoom out"
                            onClick={handleZoomOut}
                            disabled={view.zoom <= MIN_ZOOM}
                        >
                            <ZoomOutIcon fontSize="small" />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Reset view" placement="left">
                    <IconButton size="small" aria-label="Reset view" onClick={handleResetView}>
                        <CenterFocusStrongIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Stack>
        </Paper>
    )
}
