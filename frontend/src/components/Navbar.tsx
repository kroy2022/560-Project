import { Link, useLocation, useNavigate } from "react-router-dom"
import { BookOpen, Home, Bookmark, Grid3x3, Search, UserRoundPen, LogOut } from "lucide-react"
import { cn } from "../lib/utils"

interface NavbarProps {
  showSearchBar: boolean
  searchDescription?: string
  getSearchResults?: (query: string) => void
}

export function Navbar({ showSearchBar, searchDescription, getSearchResults }: NavbarProps ) {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path: string) => location.pathname == path

  const handleSignOut = () => {
    localStorage.removeItem('bookflix-user_id')
    localStorage.removeItem('bookflix-name')
    
    navigate('/');
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60">
      
      {/* 1. Added 'relative' to this parent div so we can absolutely position elements inside it */}
      <div className="relative flex w-full h-16 items-center justify-between px-4 md:px-8 gap-4">
        
        {/* Left Side: Logo & Links */}
        <div className="flex items-center gap-6 z-10"> {/* Added z-10 to ensure clickable */}
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-red-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
              BookFlix
            </span>
          </Link>

          <div className="hidden md:flex gap-6">
            <Link
              to="/dashboard"
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-zinc-50",
                isActive("/dashboard") ? "text-zinc-50" : "text-zinc-400",
              )}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link
              to="/books"
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-zinc-50",
                isActive("/books") ? "text-zinc-50" : "text-zinc-400",
              )}
            >
              <Bookmark className="h-4 w-4" />
              <span>Books</span>
            </Link>
            <Link
              to="/authors"
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-zinc-50",
                isActive("/authors") ? "text-zinc-50" : "text-zinc-400",
              )}
            >
              <UserRoundPen className="h-4 w-4" />
              <span>Authors</span>
            </Link>
          </div>
        </div>

        {/* 2. THE FIX: Changed to absolute positioning */}
        {showSearchBar && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl hidden sm:block px-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
              <input
                type="text"
                onChange={(e) => getSearchResults!(e.target.value)}
                placeholder={searchDescription}
                className="w-full h-11 pl-12 pr-4 bg-zinc-900/80 border border-zinc-700 rounded-full text-sm text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent focus:bg-zinc-900 transition-all duration-200 shadow-sm"
              />
            </div>
          </div>
        )}

        {/* Right Side: Sign Out */}
        <div className="flex items-center gap-4 z-10"> {/* Added z-10 to ensure clickable */}
          <div className="flex md:hidden gap-4">
            <Link to="/dashboard"> <Home className="h-5 w-5 text-zinc-400" /> </Link>
            <Link to="/books"> <Bookmark className="h-5 w-5 text-zinc-400" /> </Link>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-500 hover:text-white hover:bg-red-900 rounded-md transition-all duration-200"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </nav>
  )
}
