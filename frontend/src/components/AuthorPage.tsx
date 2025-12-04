import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { BookOpen, Calendar, MapPin, Award, ArrowLeft } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { BookCard } from "../components/BookCard"
import { Navbar } from "../components/Navbar"
import type { Author, BookSummary } from "../types"

export function Authors() {
    const { bookId } = useParams<{ authorId: string }>()
    const [selectedTab, setSelectedTab] = useState("about")
    const [author, setAuthor] = useState<Author>({
        authorId: 1,
        name: "J.K. Rowling",
        description: "Joanne Rowling, better known by her pen name J.K. Rowling, is a British author and philanthropist. She is best known for writing the Harry Potter fantasy series, which has won multiple awards and sold more than 500 million copies, becoming the best-selling book series in history. The books have been the basis for a film series, over which Rowling had overall approval on the scripts and was a producer on the final films. Born in Yate, Gloucestershire, Rowling was working as a researcher and bilingual secretary for Amnesty International when she conceived the idea for the Harry Potter series while on a delayed train from Manchester to London in 1990.",
        coverImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
        genres: ["Fantasy", "Young Adult", "Mystery", "Drama"],
        totalBooks: 14,
        avgRating: 4.7
    });
    const [authorBooks, setAuthorBooks] = useState<BookSummary[]>([
        {
            bookId: 1,
            isbn: "",
            title: "Harry Potter and the Philosopher's Stone",
            author: "J.K. Rowling",
            coverImage: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=300&h=450&fit=crop",
            genre: "Fantasy"
        },
        {
            bookId: 2,
            isbn: "",
            title: "Harry Potter and the Chamber of Secrets",
            author: "J.K. Rowling",
            coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop",
            genre: "Fantasy"
        },
        {
            bookId: 3,
            isbn: "",
            title: "Harry Potter and the Prisoner of Azkaban",
            author: "J.K. Rowling",
            coverImage: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=450&fit=crop",
            genre: "Fantasy"
        },
        {
            bookId: 4,
            isbn: "",
            title: "Harry Potter and the Goblet of Fire",
            author: "J.K. Rowling",
            coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=450&fit=crop",
            genre: "Fantasy"
        },
        {
            bookId: 5,
            isbn: "",
            title: "Harry Potter and the Order of the Phoenix",
            author: "J.K. Rowling",
            coverImage: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=300&h=450&fit=crop",
            genre: "Fantasy"
        },
        {
            bookId: 6,
            isbn: "",
            title: "The Casual Vacancy",
            author: "J.K. Rowling",
            coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop",
            genre: "Drama"
        }
    ]);

    return (
        <div className="min-h-screen bg-zinc-950">
        <Navbar showSearchBar={false} />
        <div className="min-h-screen bg-zinc-950 py-8 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-50 mb-6 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
            </Link>

            <div className="grid md:grid-cols-[300px,1fr] lg:grid-cols-[400px,1fr] gap-8 mb-12">
                {/* Author Image & Stats */}
                <div>
                <div className="relative">
                    <img
                    src={author.coverImage}
                    alt={author.name}
                    className="w-full aspect-square rounded-lg shadow-2xl object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 to-transparent rounded-lg" />
                </div>
                
                <Card className="mt-4 bg-zinc-900/50 border-zinc-800">
                    <CardContent className="pt-6">
                    <div className="space-y-4">
                        <div>
                        <p className="text-sm text-zinc-500 mb-1">Total Books</p>
                        <p className="text-2xl font-bold text-zinc-50">{author.totalBooks}</p>
                        </div>
                        <div>
                        <p className="text-sm text-zinc-500 mb-1">Average Rating</p>
                        {author.avgRating ? (
                            <div className="flex items-center gap-2">
                                <p className="text-2xl font-bold text-zinc-50">{author.avgRating}</p>
                                <span className="text-yellow-500">★</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <p className="text-2xl font-bold text-zinc-50">No Rating for This Author</p>
                            </div>
                        )}
                        </div>
                        <div>
                        <p className="text-sm text-zinc-500 mb-2">Genres</p>
                        <div className="flex flex-wrap gap-2">
                            {author.genres.map((genre, index) => (
                            <span 
                                key={index}
                                className="px-2 py-1 text-xs font-medium bg-red-600/20 text-red-400 border border-red-600/50 rounded-full"
                            >
                                {genre}
                            </span>
                            ))}
                        </div>
                        </div>
                    </div>
                    </CardContent>
                </Card>
                </div>

                {/* Author Details */}
                <div className="space-y-6">
                <div>
                    <h1 className="text-4xl font-bold text-zinc-50 mb-4 text-balance">{author.name}</h1>

                    <div className="flex flex-wrap gap-4 text-sm text-zinc-400 mb-6">
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span>{author.totalBooks} Books</span>
                    </div>
                    </div>
                </div>

                <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                    <TabsList>
                    <TabsTrigger value="about">About</TabsTrigger>
                    <TabsTrigger value="books">Books ({authorBooks.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="about" className="space-y-4 mt-5">
                    <div>
                        <h3 className="text-lg font-semibold text-zinc-50 mb-3">Biography</h3>
                        <p className="text-zinc-400 leading-relaxed">{author.description}</p>
                    </div>

                    </TabsContent>

                    <TabsContent value="books" className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold text-zinc-50 mb-4">
                        Books by {author.name}
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {authorBooks.map((book) => (
                            <BookCard key={book.bookId} book={book} />
                        ))}
                        </div>
                    </div>
                    </TabsContent>
                </Tabs>
                </div>
            </div>

            {/* More Books Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-zinc-50">Popular Books</h2>
                <Button variant="outline" className="bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                    View All
                </Button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {authorBooks.slice(0, 6).map((book) => (
                    <BookCard key={book.bookId} book={book} />
                ))}
                </div>
            </div>
            </div>
        </div>
        </div>
    )
}

