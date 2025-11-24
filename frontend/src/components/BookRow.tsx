import { BookCard } from "./BookCard"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"
import type { BookSummary, PopularBook } from "../types"

interface BookRowProps {
  title: string
  books: (BookSummary | PopularBook)[]
}

export function BookRow({ title, books }: BookRowProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-zinc-50 px-4 md:px-8">{title}</h2>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-4 px-4 md:px-8 pb-4">
          {books.map((book) => (
            <BookCard key={book.bookId} book={book} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
