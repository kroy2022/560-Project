import { BookCard } from "../components/BookCard"
import { Navbar } from "../components/Navbar"
import { AuthValues } from "../types"

export function SavedBooks({ user_id, user_name }: AuthValues) {
  return (
    <div className="min-h-screen bg-zinc-950 py-8 px-4 md:px-8">
      <Navbar showSearchBar={false} />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-zinc-50 mb-8">My Saved Books</h1>
        {savedBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-zinc-400 text-lg">You haven't saved any books yet</p>
            <p className="text-zinc-500 text-sm mt-2">Browse our collection and save your favorites!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {savedBooks.map((book) => (
              <BookCard key={book.bookId} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
