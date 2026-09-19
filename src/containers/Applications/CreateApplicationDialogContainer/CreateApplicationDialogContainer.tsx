import { useCallback, useState } from "react"
import { CreateApplicationDialog } from "@src/components/Applications/CreateApplicationDialog"
import type { Resource } from "@src/types"

export interface CreateApplicationDialogContainerPropsType {
    open: boolean
    selectedResources: Resource[]
    onCancel: () => void
    onCreate: (name: string, description: string) => void
}

const NAME_ERROR = "Application name is required"

export const CreateApplicationDialogContainer = ({
    open,
    selectedResources,
    onCancel,
    onCreate,
}: CreateApplicationDialogContainerPropsType) => {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [nameError, setNameError] = useState<string>()

    const resetForm = useCallback(() => {
        setName("")
        setDescription("")
        setNameError(undefined)
    }, [])

    const handleCancel = useCallback(() => {
        resetForm()
        onCancel()
    }, [resetForm, onCancel])

    const handleNameChange = useCallback((value: string) => {
        setName(value)
        setNameError(undefined)
    }, [])

    const handleSubmit = useCallback(() => {
        if (name.trim() === "") {
            setNameError(NAME_ERROR)

            return
        }

        onCreate(name, description)
        resetForm()
    }, [name, description, onCreate, resetForm])

    return (
        <CreateApplicationDialog
            open={open}
            name={name}
            description={description}
            nameError={nameError}
            selectedResources={selectedResources}
            onNameChange={handleNameChange}
            onDescriptionChange={setDescription}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
        />
    )
}
