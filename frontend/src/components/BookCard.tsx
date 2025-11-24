import { Star } from "lucide-react"
import { Link } from "react-router-dom"
import type { BookSummary, PopularBook } from "../types"

interface BookCardProps {
  book: BookSummary | PopularBook
}

function isPopularBook(book: BookSummary | PopularBook): book is PopularBook {
  return "avgRating" in book
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Link to={`/book/${book.bookId}`}>
      <div className="group relative flex-shrink-0 w-[180px] cursor-pointer transition-transform duration-300 hover:scale-105">
        <div className="relative aspect-[2/3] overflow-hidden rounded-md shadow-lg">
          <img
            src={book.coverImage || "/placeholder.svg"}
            alt={book.title}
            className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        <div className="mt-2 space-y-1">
          <h3 className="text-sm font-medium text-zinc-50 line-clamp-1">{book.title}</h3>
          <p className="text-xs text-zinc-400 line-clamp-1">{book.author}</p>
          {isPopularBook(book) && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              <span className="text-xs text-zinc-300">{book.avgRating.toFixed(1)}</span>
              <span className="text-xs text-zinc-500">({book.totalReviews})</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
