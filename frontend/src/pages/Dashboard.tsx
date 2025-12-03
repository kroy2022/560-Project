import { useState, useEffect } from "react"
import { HeroBanner } from "../components/HeroBanner"
import { BookRow } from "../components/BookRow"
import { GenreRowComponent } from "../components/GenreRow"
import { featuredBook, topReviewedBooks, savedBooks, genreRows } from "../data/mockData"
import axios from "axios"
import { API_URL } from "../api/routes"
import type { PopularBook, BookSummary, Book, Review, GenreRow, ApiResponse } from "../types"

export function Dashboard() {
  const user_id = 'kevinro.y'
  const [topReviewedBooks, setTopReviewedBooks] = useState<PopularBook[]>([]);
  const [savedBooks, setSavedBooks] = useState<BookSummary[]>([]);
  const [genreRows, setGenreRows] = useState<GenreRow[]>([]);

  useEffect(() => {
    const getDashboardData = async () => {
      await Promise.all([
        getTopReviewedBooks(),
        getSavedBooks(),
        getGenreRows()
      ]);
    }

    getDashboardData();
  }, [])

  const getTopReviewedBooks = async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/top-reviewed`);
      setTopReviewedBooks(response.data.popularBooks);
    } catch (error) {
      console.error("ERROR IN :getTopReviewedBooks ", error);
    }    
  }

  const getSavedBooks = async () => {
    try {
      const response = await axios.post(`${API_URL}/dashboard/saved`, {
          userId: user_id,
      })
      setSavedBooks(response.data.books);
    } catch (error) {
      console.error("ERROR IN getSavedBooks: ", error);
    }
  }

  const getGenreRows = async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/genre-books`);
      setGenreRows(response.data.genreRows);
    } catch (error) {
      console.error("ERROR IN getGenreRows: ", error);
    }
  }

  const getGenreBooksWithOffset = async (genre_id: number, offset: number) => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/genre?genreId=${genre_id}&offset=${offset}`);
      const newBooks: BookSummary[] = response.data.books;

      setGenreRows(prevRows =>
        prevRows.map(r => {

          if (r.genreId != genre_id) {
            return r;
          }

          const mergedBooks = [...(r.books || []), ...newBooks];
          const uniqueBooksMap = new Map<number, BookSummary>();
          mergedBooks.forEach(book => uniqueBooksMap.set(book.bookId, book));
          return { ...r, books: Array.from(uniqueBooksMap.values()) };
        })
      );
      
    } catch (error) {
      console.error("ERROR IN : ", error);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <HeroBanner book={featuredBook} />
      <div className="space-y-8 py-8">
        <BookRow title="Top Reviewed Books" books={topReviewedBooks} />
        <BookRow title="My Saved Books" books={savedBooks} />
        {genreRows.map((genreRow) => (
          <GenreRowComponent key={genreRow.genreId} genreRow={genreRow} getGenreBooksWithOffset={getGenreBooksWithOffset} />
        ))} 
      </div>
    </div>
  )
}
