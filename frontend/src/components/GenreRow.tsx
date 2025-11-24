import { BookRow } from "./BookRow"
import type { GenreRow as GenreRowType } from "../types"

interface GenreRowProps {
  genreRow: GenreRowType
}

export function GenreRow({ genreRow }: GenreRowProps) {
  return <BookRow title={genreRow.genre} books={genreRow.books} />
}
