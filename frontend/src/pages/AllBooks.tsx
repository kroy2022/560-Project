import { useState, useEffect } from "react";
import { AuthValues, BookSummary } from "../types";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../api/routes";
import { Navbar } from "../components/Navbar";
import { BookCard } from "../components/BookCard";
import { Card, CardContent } from "../components/ui/card";
import { BookOpen, Library, Tag, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export function AllBooks({ user_id, user_name }: AuthValues) {
    const [searchParams] = useSearchParams();
    const authorId = searchParams.get("authorId");
    const genreId = searchParams.get("genreId");
    const [books, setBooks] = useState<BookSummary[]>([]);
    const [filteredBooks, setFilteredBooks] = useState<BookSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isReverse, setIsReverse] = useState(false);

    useEffect(() => {
        const getBooksPerRequirement = async () => {
            if (authorId) {
                await getBooksFromAuthor();
            } else if (genreId) {
                await getBooksFromGenre();
            } else {
                await getAllBooks();
            }   

            setIsLoading(false);
        }

        window.scrollTo(0, 0);
        getBooksPerRequirement();
    }, [])

    const getBooksFromAuthor = async () => {
        try {
            const response = await axios.get(`${API_URL}/book/books?authorId=${authorId}`);
            console.log("BOOKS RESPONSE: ", response);
            setBooks(response.data.books);
            setFilteredBooks(response.data.books);
        } catch (error) {
            console.error("ERROR GETTING BOOKS FROM AUTHOR: ", error);
        }
    }

    const getBooksFromGenre = async () => {
        try {
            const response = await axios.get(`${API_URL}/book/books?genreId=${genreId}`);
            console.log("GENRE RESPONSE: ", response);
            setBooks(response.data.books);
            setFilteredBooks(response.data.books);
        } catch (error) {
            console.error("ERROR GETTING BOOKS FROM GENRE: ", error);
        }
    }

    const getAllBooks = async () => {
        try {
            const response = await axios.get(`${API_URL}/book/books`);
            setBooks(response.data.books);
            setFilteredBooks(response.data.books);
        } catch (error) {
            console.error("ERROR GETTING BOOKS: ", error);
        }
    }

    // Determine page title and icon based on filters
    const getPageTitle = () => {
        if (authorId) return books.length > 0 ? `Books by ${books[0].author}` : "Books by Author";
        if (genreId) return books.length > 0 ? `${books[0].genre} Books` : "Books in Genre";
        return "All Books";
    };

    const getPageDescription = () => {
        if (authorId) return "Explore all books written by this author";
        if (genreId) return books.length > 0 ? `Discover amazing ${books[0].genre} books in our collection` : "Discover amazing books in our collection";
        return "Browse our complete collection of books";
    };

    const getIcon = () => {
        if (authorId) return <BookOpen className="h-8 w-8 text-red-600" />;
        if (genreId) return <Tag className="h-8 w-8 text-red-600" />;
        return <Library className="h-8 w-8 text-red-600" />;
    };

    const getSearchResults = (query: string) => {
        if (query == "") {
            setFilteredBooks(books);
            return;
        }

        query = query.toLowerCase();

        let searchedBooks = books.filter((book) => {
            console.log("BOOK: ", book);
            if (book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query)|| book.genre?.toLowerCase().includes(query)) {
                console.log("IT WAS TRUE FOR: ", query);
                return book;
            }
        })
        setFilteredBooks(searchedBooks);
    }

    const sortByTitle = () => {
        const newBooks = [...filteredBooks].sort((a, b) =>
            isReverse ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
        );

        setFilteredBooks(newBooks);
        setIsReverse(!isReverse);
    }

    const showOriginalArray = () => {
        setFilteredBooks(books);
    }

    return (
        <div className="min-h-screen bg-zinc-950">
            <Navbar showSearchBar={true} searchDescription="Search for books..." getSearchResults={getSearchResults}/>
            
            <div className="py-8 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-3">
                            {/* {getIcon()} */}
                            <h1 className="text-4xl font-bold text-zinc-50">{getPageTitle()}</h1>
                        </div>
                        <p className="text-zinc-400 text-lg">{getPageDescription()}</p>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <Card className="bg-zinc-900/50 border-zinc-800">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-zinc-500 mb-1">Total Books</p>
                                        <p className="text-3xl font-bold text-zinc-50">
                                            {isLoading ? "..." : books.length}
                                        </p>
                                    </div>
                                    <Library className="h-12 w-12 text-red-600/30" />
                                </div>
                            </CardContent>
                        </Card>
                        
                        {genreId && (
                            <Card className="bg-zinc-900/50 border-zinc-800">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-zinc-500 mb-1">Genre</p>
                                            <p className="text-2xl font-bold text-zinc-50">{isLoading ? "..." : books[0].genre}</p>
                                        </div>
                                        <Tag className="h-12 w-12 text-red-600/30" />
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                        
                        <Card className="bg-zinc-900/50 border-zinc-800">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-zinc-500 mb-1">Collection</p>
                                        <p className="text-2xl font-bold text-zinc-50">
                                            {authorId ? "Author" : genreId ? "Genre" : "All"}
                                        </p>
                                    </div>
                                    <div className="h-12 w-12 rounded-full bg-red-600/20 flex items-center justify-center">
                                        <span className="text-2xl">📚</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="aspect-[2/3] bg-zinc-800 rounded-lg animate-pulse" />
                                    <div className="space-y-2">
                                        <div className="h-4 bg-zinc-800 rounded animate-pulse" />
                                        <div className="h-3 bg-zinc-800 rounded animate-pulse w-3/4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Books Grid */}
                    {!isLoading && filteredBooks.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-semibold text-zinc-50">
                                    Showing {filteredBooks.length} {filteredBooks.length === 1 ? "book" : "books"}
                                </h2>
                                
                                {/* Optional: Add sort/filter buttons here */}
                                <div className="flex gap-2">
                                    <button onClick={() => sortByTitle()} className="px-4 py-2 text-sm bg-zinc-900 border border-zinc-800 rounded-md text-zinc-300 hover:bg-zinc-800 hover:border-red-600 transition-all duration-200">
                                        Sort by Title: {isReverse ? "A → Z" : "Z → A"}
                                    </button>
                                    <button onClick={() => showOriginalArray()} className="px-4 py-2 text-sm bg-zinc-900 border border-zinc-800 rounded-md text-zinc-300 hover:bg-zinc-800 hover:border-red-600 transition-all duration-200">
                                        See Original
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                                {filteredBooks.map((book) => (
                                    <BookCard key={book.bookId} book={book} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && filteredBooks.length == 0 && (
                        <div className="flex flex-col items-center justify-center py-20 px-4">
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-full p-6 mb-6">
                                <BookOpen className="h-24 w-24 text-zinc-700" />
                            </div>
                            <h2 className="text-2xl font-bold text-zinc-50 mb-2">No Books Found</h2>
                            <p className="text-zinc-400 text-center max-w-md mb-6">
                                {authorId 
                                    ? "This author doesn't have any books in our collection yet."
                                    : genreId 
                                    ? `We don't have any books in this genre available at the moment.`
                                    : "No books available in our collection at the moment."}
                            </p>
                            <Link 
                                to="/dashboard"
                                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors duration-200"
                            >
                                Browse All Books
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}