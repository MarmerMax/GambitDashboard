import { useEffect, useState } from 'react'
import { RESOURCES } from '../data/resources'
import type { Resource } from '../types'

const LOAD_DELAY_MS = 450

export const useResources = () => {
    const [resources, setResources] = useState<Resource[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setResources(RESOURCES)
            setIsLoading(false)
        }, LOAD_DELAY_MS)

        return () => window.clearTimeout(timer)
    }, [])

    return { resources, isLoading }
}
