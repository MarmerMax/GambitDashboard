import type { ChangeEvent, FormEvent } from 'react'
import { useCallback, useState } from 'react'
import type { Resource } from '../types'
import { Badge } from './Badge'
import { Modal } from './Modal'

interface CreateApplicationModalProps {
    selectedResources: Resource[]
    onCancel: () => void
    onCreate: (name: string, description: string) => void
}

const TITLE_ID = 'create-application-title'
const NAME_ERROR = 'Application name is required'

export const CreateApplicationModal = ({ selectedResources, onCancel, onCreate }: CreateApplicationModalProps) => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [error, setError] = useState('')

    const handleNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
        setError('')
    }, [])

    const handleDescriptionChange = useCallback(
        (event: ChangeEvent<HTMLTextAreaElement>) => setDescription(event.target.value),
        [],
    )

    const handleSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault()

            if (name.trim() === '') {
                setError(NAME_ERROR)

                return
            }

            onCreate(name, description)
        },
        [name, description, onCreate],
    )

    return (
        <Modal titleId={TITLE_ID} onClose={onCancel}>
            <form className="modal__form" onSubmit={handleSubmit} noValidate>
                <header className="modal__header">
                    <h2 className="modal__title" id={TITLE_ID}>
                        Create Application
                    </h2>
                    <p className="modal__subtitle">
                        Group {selectedResources.length} selected resource
                        {selectedResources.length === 1 ? '' : 's'} into a single application.
                    </p>
                </header>

                <div className="modal__body">
                    <div className="field">
                        <label className="field__label" htmlFor="application-name">
                            Application name <span className="field__required">*</span>
                        </label>
                        <input
                            className={error ? 'field__control field__control--invalid' : 'field__control'}
                            id="application-name"
                            type="text"
                            value={name}
                            onChange={handleNameChange}
                            placeholder="e.g. Checkout Platform"
                            aria-invalid={Boolean(error)}
                            aria-describedby={error ? 'application-name-error' : undefined}
                            autoFocus
                        />
                        {error && (
                            <p className="field__error" id="application-name-error" role="alert">
                                {error}
                            </p>
                        )}
                    </div>

                    <div className="field">
                        <label className="field__label" htmlFor="application-description">
                            Description <span className="field__optional">(optional)</span>
                        </label>
                        <textarea
                            className="field__control field__control--textarea"
                            id="application-description"
                            rows={3}
                            value={description}
                            onChange={handleDescriptionChange}
                            placeholder="What does this application do?"
                        />
                    </div>

                    <div className="field">
                        <p className="field__label">Selected resources</p>
                        <ul className="selected-resources">
                            {selectedResources.map((resource) => (
                                <li className="selected-resources__item" key={resource.id}>
                                    <span>
                                        <span className="resource-name">{resource.name}</span>
                                        <span className="resource-meta">{resource.type}</span>
                                    </span>
                                    <span className="selected-resources__badges">
                                        <Badge tone={resource.provider} />
                                        <Badge tone={resource.criticality} />
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <footer className="modal__footer">
                    <button className="button button--ghost" type="button" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="button button--primary" type="submit">
                        Create Application
                    </button>
                </footer>
            </form>
        </Modal>
    )
}
