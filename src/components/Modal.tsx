import type { MouseEvent, ReactNode } from 'react'
import { useCallback, useEffect } from 'react'

interface ModalProps {
    titleId: string
    onClose: () => void
    children: ReactNode
}

export const Modal = ({ titleId, onClose, children }: ModalProps) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose()
        }

        document.addEventListener('keydown', handleKeyDown)
        document.body.classList.add('is-modal-open')

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.classList.remove('is-modal-open')
        }
    }, [onClose])

    const handleBackdropClick = useCallback(
        (event: MouseEvent<HTMLDivElement>) => {
            if (event.target === event.currentTarget) onClose()
        },
        [onClose],
    )

    return (
        <div className="backdrop" onMouseDown={handleBackdropClick}>
            <div className="modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
                {children}
            </div>
        </div>
    )
}
