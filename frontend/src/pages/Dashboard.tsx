import { HeroBanner } from "../components/HeroBanner"
import { BookRow } from "../components/BookRow"
import { GenreRow } from "../components/GenreRow"
import { featuredBook, topReviewedBooks, savedBooks, genreRows } from "../data/mockData"

export function Dashboard() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <HeroBanner book={featuredBook} />
      <div className="space-y-8 py-8">
        <BookRow title="Top Reviewed Books" books={topReviewedBooks} />
        <BookRow title="My Saved Books" books={savedBooks} />
        {genreRows.map((genreRow) => (
          <GenreRow key={genreRow.genreId} genreRow={genreRow} />
        ))}
      </div>
    </div>
  )
}
