import { useCallback, useState } from "react"
import { CreateApplicationDialog } from "@src/components/Applications"
import { useCreateApplicationMutation } from "@src/state/Applications"
import { getErrorMessage } from "@src/state/api"
import type { Application, Resource } from "@src/types"

export interface CreateApplicationDialogContainerPropsType {
    open: boolean
    selectedResources: Resource[]
    onCancel: () => void
    onCreated: (application: Application) => void
}

const NAME_ERROR = "Application name is required"

export const CreateApplicationDialogContainer = ({
    open,
    selectedResources,
    onCancel,
    onCreated,
}: CreateApplicationDialogContainerPropsType) => {
    const [createApplication, { isLoading: isSubmitting, error, reset }] =
        useCreateApplicationMutation()

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [nameError, setNameError] = useState<string>()

    const resetForm = useCallback(() => {
        setName("")
        setDescription("")
        setNameError(undefined)
        reset()
    }, [reset])

    const handleNameChange = useCallback((value: string) => {
        setName(value)
        setNameError(undefined)
    }, [])

    const handleCancel = useCallback(() => {
        resetForm()
        onCancel()
    }, [resetForm, onCancel])

    const handleSubmit = useCallback(async () => {
        if (name.trim() === "") {
            setNameError(NAME_ERROR)

            return
        }

        const resourceIds = selectedResources.map((resource) => resource.id)

        try {
            const application = await createApplication({
                name,
                description,
                resourceIds,
            }).unwrap()

            resetForm()
            onCreated(application)
        } catch {
            return
        }
    }, [createApplication, name, description, selectedResources, resetForm, onCreated])

    return (
        <CreateApplicationDialog
            open={open}
            name={name}
            description={description}
            nameError={nameError}
            submitError={getErrorMessage(error)}
            isSubmitting={isSubmitting}
            selectedResources={selectedResources}
            onNameChange={handleNameChange}
            onDescriptionChange={setDescription}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
        />
    )
}
