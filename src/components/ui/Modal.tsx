import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/utils/cn"
import { Button } from "./Button"

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
    className?: string
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        if (isOpen) {
            document.body.style.overflow = "hidden"
            window.addEventListener("keydown", handleEscape)
        }
        return () => {
            document.body.style.overflow = "unset"
            window.removeEventListener("keydown", handleEscape)
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />
            <div className={cn(
                "relative w-full max-w-lg rounded-xl border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200",
                className
            )}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold tracking-tight">{title}</h2>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                {children}
            </div>
        </div>
    )
}
