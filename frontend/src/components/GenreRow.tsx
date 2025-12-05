import { Link } from "react-router-dom"
import { BookCard } from "./BookCard"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"
import { ArrowRight } from "lucide-react"
import type { GenreRow as GenreRowType } from "../types"

interface GenreRowComponentProps {
  genreRow: GenreRowType
  getGenreBooksWithOffset: (genre_id: number, offset: number) => void
}

export function GenreRowComponent({ genreRow, getGenreBooksWithOffset }: GenreRowComponentProps) {
  return (
    <div className="space-y-4">
      {/* Header with Title and View All Button */}
      <div className="flex items-center justify-between px-4 md:px-8">
        <h2 className="text-xl font-semibold text-zinc-50">{genreRow.genre}</h2>
        <Link 
          to={`/books?genreId=${genreRow.genreId}`}
          className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-400 hover:text-red-500 transition-all duration-200"
        >
          <span>View All</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>

      {/* Scrollable Books Row */}
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-4 px-4 md:px-8 pb-4">
          {genreRow.genreBooks && genreRow.genreBooks.map((book) => (
            <BookCard key={book.bookId} book={book} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
