import Alert from "@mui/material/Alert"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import type { ChangeEvent, FormEvent } from "react"
import { useCallback } from "react"
import type { Resource } from "@src/types"
import { CriticalityChip } from "@src/components/Resources/CriticalityChip"
import { ProviderChip } from "@src/components/Resources/ProviderChip"

export interface CreateApplicationDialogPropsType {
    open: boolean
    name: string
    description: string
    nameError?: string
    submitError?: string
    isSubmitting: boolean
    selectedResources: Resource[]
    onNameChange: (value: string) => void
    onDescriptionChange: (value: string) => void
    onSubmit: () => void
    onCancel: () => void
}

const DESCRIPTION_ROWS = 3

export const CreateApplicationDialog = ({
    open,
    name,
    description,
    nameError,
    submitError,
    isSubmitting,
    selectedResources,
    onNameChange,
    onDescriptionChange,
    onSubmit,
    onCancel,
}: CreateApplicationDialogPropsType) => {
    const handleNameChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => onNameChange(event.target.value),
        [onNameChange],
    )

    const handleDescriptionChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => onDescriptionChange(event.target.value),
        [onDescriptionChange],
    )

    const handleSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            onSubmit()
        },
        [onSubmit],
    )

    return (
        <Dialog open={open} onClose={onCancel} fullWidth maxWidth="sm">
            <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ display: "flex", flexDirection: "column", minHeight: 0 }}
            >
                <DialogTitle>
                    <Stack>
                        <Typography variant="h6">Create Application</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Group {selectedResources.length} selected resource
                            {selectedResources.length === 1 ? "" : "s"} into a single application.
                        </Typography>
                    </Stack>
                </DialogTitle>

                <DialogContent dividers>
                    <Stack spacing={2}>
                        {submitError && <Alert severity="error">{submitError}</Alert>}
                        <TextField
                            autoFocus
                            required
                            fullWidth
                            label="Application name"
                            placeholder="e.g. Checkout Platform"
                            value={name}
                            onChange={handleNameChange}
                            error={Boolean(nameError)}
                            helperText={nameError}
                        />

                        <TextField
                            fullWidth
                            multiline
                            rows={DESCRIPTION_ROWS}
                            label="Description (optional)"
                            placeholder="What does this application do?"
                            value={description}
                            onChange={handleDescriptionChange}
                        />

                        <Stack spacing={1}>
                            <Typography variant="subtitle2">Selected resources</Typography>
                            {selectedResources.map((resource) => (
                                <Stack
                                    key={resource.id}
                                    direction="row"
                                    spacing={1}
                                    sx={{
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        p: 1,
                                        border: 1,
                                        borderColor: "divider",
                                        borderRadius: 1,
                                    }}
                                >
                                    <Stack sx={{ minWidth: 0 }}>
                                        <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                                            {resource.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" noWrap>
                                            {resource.type}
                                        </Typography>
                                    </Stack>
                                    <Stack direction="row" spacing={0.5}>
                                        <ProviderChip provider={resource.provider} />
                                        <CriticalityChip criticality={resource.criticality} />
                                    </Stack>
                                </Stack>
                            ))}
                            {selectedResources.length === 0 && (
                                <Chip
                                    size="small"
                                    variant="outlined"
                                    label="No resources selected"
                                />
                            )}
                        </Stack>
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onCancel} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" loading={isSubmitting}>
                        Create Application
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}
