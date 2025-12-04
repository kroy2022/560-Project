import { BookRow } from "./BookRow"
import type { GenreRow as GenreRowType } from "../types"

interface GenreRowComponentProps {
  genreRow: GenreRowType
  getGenreBooksWithOffset: (genre_id: number, offset: number) => void
}

export function GenreRowComponent({ genreRow, getGenreBooksWithOffset }: GenreRowComponentProps) {
  console.log("BOOKS IN GENREROWCOMPONENT: ", genreRow);
  return <BookRow title={genreRow.genre} books={genreRow.genreBooks}/>
}
