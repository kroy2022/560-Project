import { Play, Info, Star } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import type { Book } from "../types"

interface HeroBannerProps {
  book: Book | null
}

export function HeroBanner({ book }: HeroBannerProps) {
  // Loading state when book is null
  if (!book) {
    return (
      <div className="relative h-[70vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <div className="h-full w-full bg-zinc-900 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
        </div>

        <div className="relative h-full flex items-center px-4 md:px-8">
          <div className="max-w-2xl space-y-4">
            {/* Title skeleton */}
            <div className="space-y-3">
              <div className="h-12 md:h-16 bg-zinc-800 rounded-lg animate-pulse w-3/4" />
              <div className="h-12 md:h-16 bg-zinc-800 rounded-lg animate-pulse w-1/2" />
            </div>
            
            {/* Author skeleton */}
            <div className="h-6 md:h-7 bg-zinc-800 rounded-lg animate-pulse w-48" />
            
            {/* Rating skeleton */}
            <div className="h-5 bg-zinc-800 rounded-lg animate-pulse w-24" />
            
            {/* Description skeleton */}
            <div className="space-y-2">
              <div className="h-4 md:h-5 bg-zinc-800 rounded animate-pulse w-full" />
              <div className="h-4 md:h-5 bg-zinc-800 rounded animate-pulse w-5/6" />
              <div className="h-4 md:h-5 bg-zinc-800 rounded animate-pulse w-4/6" />
            </div>
            
            {/* Buttons skeleton */}
            <div className="flex gap-3 pt-4">
              <div className="h-12 w-36 bg-zinc-800 rounded-md animate-pulse" />
              <div className="h-12 w-36 bg-zinc-800 rounded-md animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Normal display when book is available
  return (
    <div className="relative h-[70vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={
            book.coverImage
              ? (book.coverImage === "bad" ? "/default.png" : book.coverImage)
              : "/default.png"
          }
          alt={book.title}
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
      </div>

      <div className="relative h-full flex items-center px-4 md:px-8">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-zinc-50 text-balance">{book.title}</h1>
          <p className="text-lg md:text-xl text-zinc-300">by {book.author}</p>
          
          {/* Rating Display */}
          {book.avgRating && (
            <div className="flex items-center gap-2 py-1">
              <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
              <span className="text-base md:text-lg font-semibold text-zinc-50">{book.avgRating.toFixed(1)}</span>
              <span className="text-sm md:text-base text-zinc-400">/ 5</span>
            </div>
          )}
          
          <p className="text-sm md:text-base text-zinc-400 line-clamp-3 leading-relaxed">{book.description}</p>
          <div className="flex gap-3 pt-4">
            <Link to={`/book?book_id=${book.bookId}&openReview=true`}>
              <Button size="lg" className="gap-2">
                <Play className="h-5 w-5" />
                Review Now
              </Button>
            </Link>
            <Link to={`/book?book_id=${book.bookId}`}>
              <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                <Info className="h-5 w-5" />
                More Info
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
