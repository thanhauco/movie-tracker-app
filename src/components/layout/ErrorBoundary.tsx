import { Component, ErrorInfo, ReactNode } from "react"
import { Button } from "@/components/ui/Button"
import { AlertTriangle, RefreshCcw, Home } from "lucide-react"

interface Props {
    children?: ReactNode
}

interface State {
    hasError: boolean
    error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    }

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo)
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center p-4 bg-background">
                    <div className="max-w-md w-full space-y-8 text-center">
                        <div className="flex justify-center">
                            <div className="h-24 w-24 rounded-full bg-destructive/10 flex items-center justify-center border-2 border-destructive/20">
                                <AlertTriangle className="h-12 w-12 text-destructive" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-black tracking-tighter">Something went wrong</h1>
                            <p className="text-muted-foreground">
                                An unexpected error occurred. We've been notified and are looking into it.
                            </p>
                            {this.state.error && (
                                <pre className="mt-4 p-4 rounded-lg bg-muted text-xs text-left overflow-auto max-h-40 border border-white/5">
                                    {this.state.error.message}
                                </pre>
                            )}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                            <Button
                                onClick={() => window.location.reload()}
                                className="gap-2"
                            >
                                <RefreshCcw className="h-4 w-4" />
                                Try Again
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => window.location.href = '/'}
                                className="gap-2"
                            >
                                <Home className="h-4 w-4" />
                                Go Home
                            </Button>
                        </div>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}
