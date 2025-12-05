import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { BookOpen, ArrowLeft } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Navbar } from "../components/Navbar"
import type { Author } from "../types"
import { API_URL } from "../api/routes"
import axios from "axios"

export function AuthorPage() {
    const { authorId } = useParams<{ authorId: string }>()
    const [author, setAuthor] = useState<Author | null>(null);

    useEffect(() => {
        const getAuthorInfo = async () => {
            try {
                console.log("AUTHOR ID: ", authorId);
                const response = await axios.get(`${API_URL}/authors/author?authorId=${authorId}`);
                console.log("AUTHOR INFO RESPONSE: ", response);
                setAuthor(response.data.author);
            } catch (error) {
                console.error("ERROR IN getAuthorInfo ", error);
            }    
        }

        getAuthorInfo();
    }, [])

    // Loading state when author is null
    if (!author) {
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
                            {/* Author Image & Stats Skeleton */}
                            <div>
                                {/* Image Skeleton */}
                                <div className="relative">
                                    <div className="w-full aspect-square rounded-lg bg-zinc-800 animate-pulse" />
                                </div>
                                
                                {/* Stats Card Skeleton */}
                                <Card className="mt-4 bg-zinc-900/50 border-zinc-800">
                                    <CardContent className="pt-6">
                                        <div className="space-y-4">
                                            <div>
                                                <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse mb-2" />
                                                <div className="h-8 w-16 bg-zinc-800 rounded animate-pulse" />
                                            </div>
                                            <div>
                                                <div className="h-4 w-28 bg-zinc-800 rounded animate-pulse mb-2" />
                                                <div className="h-8 w-20 bg-zinc-800 rounded animate-pulse" />
                                            </div>
                                            <div>
                                                <div className="h-4 w-16 bg-zinc-800 rounded animate-pulse mb-2" />
                                                <div className="flex flex-wrap gap-2">
                                                    <div className="h-6 w-16 bg-zinc-800 rounded-full animate-pulse" />
                                                    <div className="h-6 w-20 bg-zinc-800 rounded-full animate-pulse" />
                                                    <div className="h-6 w-14 bg-zinc-800 rounded-full animate-pulse" />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Author Details Skeleton */}
                            <div className="space-y-6">
                                {/* Header with Name and Button Skeleton */}
                                <div className="flex items-start justify-between gap-6">
                                    <div>
                                        <div className="h-10 w-64 bg-zinc-800 rounded animate-pulse mb-4" />
                                        <div className="h-5 w-32 bg-zinc-800 rounded animate-pulse" />
                                    </div>
                                    <div className="h-10 w-32 bg-zinc-800 rounded animate-pulse" />
                                </div>

                                {/* Content Skeleton */}
                                <div className="space-y-4 mt-8">
                                    <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse mb-3" />
                                    <div className="space-y-2">
                                        <div className="h-4 w-full bg-zinc-800 rounded animate-pulse" />
                                        <div className="h-4 w-full bg-zinc-800 rounded animate-pulse" />
                                        <div className="h-4 w-5/6 bg-zinc-800 rounded animate-pulse" />
                                        <div className="h-4 w-4/6 bg-zinc-800 rounded animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

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
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-bold text-zinc-50 mb-4 text-balance">{author.name}</h1>

                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <BookOpen className="h-4 w-4" />
                    <span>{author.totalBooks} {author.totalBooks === 1 ? 'Book' : 'Books'}</span>
                  </div>
                </div>

                <Link to={`/books?authorId=${authorId}`}>
                  <Button 
                    variant="outline" 
                    className="bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:border-red-600 hover:text-red-500 transition-all duration-200 whitespace-nowrap"
                  >
                    View All Books
                  </Button>
                </Link>
              </div>

              {/* About Section */}
              <div className="space-y-4 mt-8">
                <h3 className="text-2xl font-semibold text-zinc-50 mb-4">About the Author</h3>
                {author.description ? (
                  <p className="text-zinc-400 leading-relaxed text-lg">{author.description}</p>
                ) : (
                  <p className="text-zinc-500 italic">No biography available for this author.</p>
                )}
              </div>
            </div>
          </div>
            </div>
        </div>
        </div>
    )
}

