import { useState, useEffect } from "react"
import { HeroBanner } from "../components/HeroBanner"
import { BookRow } from "../components/BookRow"
import { GenreRowComponent } from "../components/GenreRow"
import axios from "axios"
import { API_URL } from "../api/routes"
import type { PopularBook, BookSummary, Book, Review, GenreRow, ApiResponse, AuthValues } from "../types"
import { Navbar } from "../components/Navbar"

export function Dashboard({ user_id, user_name }: AuthValues) {
  console.log("USER ID AND NAME: ", user_id, name);
  const [topReviewedBooks, setTopReviewedBooks] = useState<PopularBook[]>([]);
  const [savedBooks, setSavedBooks] = useState<BookSummary[]>([]);
  const [genreRows, setGenreRows] = useState<GenreRow[]>([]);
  const [featuredBook, setFeaturedBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BookSummary[]>([]);

  useEffect(() => {
    const getDashboardData = async () => {
      await Promise.all([
        getFeaturedBook(),
       // getTopReviewedBooks(),
        getSavedBooks(),
        getGenreRows()
      ]);
    }

    getDashboardData();
  }, [])

  const getFeaturedBook = async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/featured`);
      console.log("FEATURED RESPONSE: ", response);
      setFeaturedBook(response.data.featuredBook);
    } catch (error) {
      console.error("ERROR IN getFeaturedBook ", error);
    }    
  }

  const getTopReviewedBooks = async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/top-reviewed`);
      setTopReviewedBooks(response.data.popularBooks);
    } catch (error) {
      console.error("ERROR IN getTopReviewedBooks ", error);
    }    
  }

  const getSavedBooks = async () => {
    try {
      const response = await axios.post(`${API_URL}/dashboard/saved`, {
          userId: user_id,
      })
      console.log("SAVED BOOKS RESPONSE: ", response);
      setSavedBooks(response.data.books);
    } catch (error) {
      console.error("ERROR IN getSavedBooks: ", error);
    }
  }

  const getGenreRows = async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/genre-books`);
      console.log("GENRE ROWS RESPONSE: ", response.data);
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

          const mergedBooks = [...(r.genreBooks || []), ...newBooks];
          const uniqueBooksMap = new Map<number, BookSummary>();
          mergedBooks.forEach(book => uniqueBooksMap.set(book.bookId, book));
          return { ...r, books: Array.from(uniqueBooksMap.values()) };
        })
      );
      
    } catch (error) {
      console.error("ERROR IN : ", error);
    }
  }

  const getSearchResults = async (query: string) => {
    setSearchQuery(query);

    if (query != "") {
      try {
        const response = await axios.get(`${API_URL}/dashboard/search?query=${query}`);
        console.log("SEARCH RESULTS RESPONSE: ", response);
        setSearchResults(response.data.searchResults);

        if (response.status != 200) {;
          alert("Error getting search results");
          setSearchQuery('');
          return;
        }
        
      } catch (error) {
        console.error("ERROR GETTING SEARCH RESULTS: ", error);
      }
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar showSearchBar={true} getSearchResults={getSearchResults}/>
      
      {searchQuery == "" ? (
        <>
          <HeroBanner book={featuredBook} />
          <div className="space-y-8 py-8">
            <BookRow title="Top Reviewed Books" books={topReviewedBooks} />
            <BookRow title={`${user_name}'s Saved Books`} books={savedBooks} />
            {genreRows.map((genreRow) => (
              <GenreRowComponent key={genreRow.genreId} genreRow={genreRow} getGenreBooksWithOffset={getGenreBooksWithOffset} />
            ))} 
          </div>
        </>
      ) : (
        <div className="space-y-8 py-8">
          <BookRow title="Search Results" books={searchResults} />
        </div>
      )}
    </div>
  )
}
