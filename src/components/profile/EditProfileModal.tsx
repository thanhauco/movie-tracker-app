import { useState, useRef } from "react"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useUpdateProfile, useUploadAvatar } from "@/hooks/useProfile"
import { Camera, Loader2 } from "lucide-react"

interface EditProfileModalProps {
    isOpen: boolean
    onClose: () => void
    profile: any
}

export function EditProfileModal({ isOpen, onClose, profile }: EditProfileModalProps) {
    const [username, setUsername] = useState(profile?.username || "")
    const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "")
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile()
    const { mutateAsync: uploadAvatar } = useUploadAvatar()

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            setIsUploading(true)
            const publicUrl = await uploadAvatar({ userId: profile.id, file })
            setAvatarUrl(publicUrl)
        } finally {
            setIsUploading(false)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        updateProfile({
            userId: profile.id,
            updates: {
                username,
                avatar_url: avatarUrl,
                updated_at: new Date().toISOString()
            }
        }, {
            onSuccess: () => onClose()
        })
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative group">
                        <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 overflow-hidden">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                            ) : (
                                <Camera className="h-8 w-8 text-primary/40" />
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <Loader2 className="h-6 w-6 animate-spin text-white" />
                            ) : (
                                <Camera className="h-6 w-6 text-white" />
                            )}
                        </button>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                    <p className="text-xs text-muted-foreground">Click to change avatar</p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Username</label>
                    <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                        required
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isUpdating}>
                        Save Changes
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
