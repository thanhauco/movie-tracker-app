import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/Button"

export function Header() {
    const { user, signOut } = useAuth()

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
            <div className="container flex h-16 items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center font-bold text-primary-foreground">
                        M
                    </div>
                    <span className="text-xl font-bold tracking-tight">MovieTracker</span>
                </Link>

                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link to="/" className="text-primary">Discover</Link>
                    <Link to="/watchlists" className="text-muted-foreground hover:text-foreground transition-colors">Watchlists</Link>
                    <Link to="/activity" className="text-muted-foreground hover:text-foreground transition-colors">Community</Link>
                </nav>

                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground hidden sm:inline-block">
                                {user.email}
                            </span>
                            <Link to="/profile" className="text-sm font-medium hover:text-primary transition-colors">
                                Profile
                            </Link>
                            <Button variant="outline" size="sm" onClick={() => signOut()}>
                                Sign Out
                            </Button>
                        </div>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button variant="ghost" size="sm">Sign In</Button>
                            </Link>
                            <Link to="/signup">
                                <Button size="sm">Join Free</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
