import { Link, useLocation } from "react-router-dom"
import { BookOpen, Home, Bookmark, Grid3x3 } from "lucide-react"
import { cn } from "../lib/utils"

export function Navbar() {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60">
      <div className="container flex h-16 items-center px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2 mr-8">
          <BookOpen className="h-6 w-6 text-red-600" />
          <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
            BookFlix
          </span>
        </Link>

        <div className="flex gap-6">
          <Link
            to="/dashboard"
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors hover:text-zinc-50",
              isActive("/dashboard") ? "text-zinc-50" : "text-zinc-400",
            )}
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <Link
            to="/saved"
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors hover:text-zinc-50",
              isActive("/saved") ? "text-zinc-50" : "text-zinc-400",
            )}
          >
            <Bookmark className="h-4 w-4" />
            <span className="hidden sm:inline">Saved</span>
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-50"
          >
            <Grid3x3 className="h-4 w-4" />
            <span className="hidden sm:inline">Genres</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
