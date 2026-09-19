import { useCallback, useState } from "react"
import { CreateApplicationDialog } from "@src/components/Applications/CreateApplicationDialog"
import { createApplication } from "@src/api/Applications/applicationsApi"
import { addApplication } from "@src/state/Applications/applicationsSlice"
import { useAppDispatch } from "@src/state/hooks"
import type { Application, Resource } from "@src/types"

export interface CreateApplicationDialogContainerPropsType {
    open: boolean
    selectedResources: Resource[]
    onCancel: () => void
    onCreated: (application: Application) => void
}

const NAME_ERROR = "Application name is required"
const CREATE_ERROR = "Could not create the application. Please try again."

export const CreateApplicationDialogContainer = ({
    open,
    selectedResources,
    onCancel,
    onCreated,
}: CreateApplicationDialogContainerPropsType) => {
    const dispatch = useAppDispatch()

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [nameError, setNameError] = useState<string>()
    const [submitError, setSubmitError] = useState<string>()
    const [isLoading, setIsLoading] = useState(false)

    const resetForm = useCallback(() => {
        setName("")
        setDescription("")
        setNameError(undefined)
        setSubmitError(undefined)
    }, [])

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

        setSubmitError(undefined)
        setIsLoading(true)

        try {
            const application = await createApplication({ name, description, resourceIds })

            dispatch(addApplication(application))
            resetForm()
            onCreated(application)
        } catch {
            setSubmitError(CREATE_ERROR)
        } finally {
            setIsLoading(false)
        }
    }, [dispatch, name, description, selectedResources, resetForm, onCreated])

    return (
        <CreateApplicationDialog
            open={open}
            name={name}
            description={description}
            nameError={nameError}
            submitError={submitError}
            isSubmitting={isLoading}
            selectedResources={selectedResources}
            onNameChange={handleNameChange}
            onDescriptionChange={setDescription}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
        />
    )
}
