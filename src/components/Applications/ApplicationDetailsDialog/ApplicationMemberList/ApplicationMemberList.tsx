import Chip from "@mui/material/Chip"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { Resource } from "@src/types"
import { CriticalityChip } from "@src/components/Resources/CriticalityChip"
import { EnvironmentChip } from "@src/components/Resources/EnvironmentChip"
import { OpenIssues } from "@src/components/Resources/OpenIssues"
import { ProviderChip } from "@src/components/Resources/ProviderChip"

export interface ApplicationMemberListPropsType {
    resources: Resource[]
}

export const ApplicationMemberList = ({ resources }: ApplicationMemberListPropsType) => (
    <Stack spacing={1}>
        {resources.map((resource) => (
            <Paper key={resource.id} sx={{ p: 1.5, backgroundColor: "background.default" }}>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    sx={{ justifyContent: "space-between", alignItems: { sm: "center" } }}
                >
                    <Stack>
                        <Typography variant="subtitle2">{resource.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                            {resource.type} · {resource.region} · {resource.owner}
                        </Typography>
                        <Stack
                            direction="row"
                            spacing={0.5}
                            useFlexGap
                            sx={{ flexWrap: "wrap", mt: 0.5 }}
                        >
                            {resource.tags.map((tag) => (
                                <Chip key={tag} size="small" variant="outlined" label={tag} />
                            ))}
                        </Stack>
                    </Stack>
                    <Stack direction="row" spacing={0.5} useFlexGap sx={{ flexWrap: "wrap" }}>
                        <ProviderChip provider={resource.provider} />
                        <EnvironmentChip environment={resource.environment} />
                        <CriticalityChip criticality={resource.criticality} />
                        <OpenIssues count={resource.openIssues} />
                    </Stack>
                </Stack>
            </Paper>
        ))}
    </Stack>
)
