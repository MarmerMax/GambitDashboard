import Alert from "@mui/material/Alert"
import AlertTitle from "@mui/material/AlertTitle"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import { Component } from "react"
import type { ErrorInfo, ReactNode } from "react"

export interface ErrorBoundaryPropsType {
    children: ReactNode
}

interface ErrorBoundaryStateType {
    error?: Error
}

const reloadPage = () => window.location.reload()

export class ErrorBoundary extends Component<ErrorBoundaryPropsType, ErrorBoundaryStateType> {
    state: ErrorBoundaryStateType = {}

    static getDerivedStateFromError(error: Error): ErrorBoundaryStateType {
        return { error }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Unhandled rendering error", error, errorInfo.componentStack)
    }

    render() {
        const { error } = this.state

        if (!error) return this.props.children

        return (
            <Container maxWidth="sm" sx={{ py: 6 }}>
                <Alert
                    severity="error"
                    action={
                        <Button color="inherit" size="small" onClick={reloadPage}>
                            Reload
                        </Button>
                    }
                >
                    <AlertTitle>Something went wrong</AlertTitle>
                    {error.message}
                </Alert>
            </Container>
        )
    }
}
