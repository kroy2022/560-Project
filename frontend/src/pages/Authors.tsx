import { useState, useEffect } from "react";
import { AuthorSummary, AuthValues } from "../types"
import { Navbar } from "../components/Navbar"
import { UserRoundPen, BookOpen, ArrowRight } from "lucide-react"
import { Card, CardContent } from "../components/ui/card"
import axios from "axios";
import { API_URL } from "../api/routes";

export function Authors({ user_id, user_name }: AuthValues) {
    const [authors, setAuthors] = useState<AuthorSummary[]>([]);
    const [totalBooks, setTotalBooks] = useState(0);
    const [totalGenres, setTotalGenres] = useState(0);

    useEffect(() => {
        const getAuthorsInformation = async () => {
            try {
                const response = await axios.get(`${API_URL}/authorsau`);
                console.log("FEATURED RESPONSE: ", response);
                setAuthors(response.data.authors);
                setTotalBooks(response.data.totalBooks);
                setTotalGenres(response.data.totalGenres);
            } catch (error) {
                console.error("ERROR IN getAuthorsInformation ", error);
            }    
        }

        getAuthorsInformation();
    }, [])

    
    
    return (
        <div className="min-h-screen bg-zinc-950">
            <Navbar showSearchBar={false} />
            
            <div className="py-8 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-3">
                            <UserRoundPen className="h-8 w-8 text-red-600" />
                            <h1 className="text-4xl font-bold text-zinc-50">BookFlix Authors</h1>
                        </div>
                        <p className="text-zinc-400 text-lg">
                            Discover renowned authors and explore their literature
                        </p>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <Card className="bg-zinc-900/50 border-zinc-800">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-zinc-500 mb-1">Total Authors</p>
                                        <p className="text-3xl font-bold text-zinc-50">{authors.length}</p>
                                    </div>
                                    <UserRoundPen className="h-12 w-12 text-red-600/30" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-zinc-900/50 border-zinc-800">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-zinc-500 mb-1">Books Available</p>
                                        <p className="text-3xl font-bold text-zinc-50">{totalBooks}+</p>
                                    </div>
                                    <BookOpen className="h-12 w-12 text-red-600/30" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-zinc-900/50 border-zinc-800">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-zinc-500 mb-1">Genres</p>
                                        <p className="text-3xl font-bold text-zinc-50">{totalGenres}</p>
                                    </div>
                                    <div className="h-12 w-12 rounded-full bg-red-600/20 flex items-center justify-center">
                                        <span className="text-2xl">📚</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Authors Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {authors.map((author) => (
                            <Card 
                                key={author.authorId}
                                className="group bg-zinc-900/50 border-zinc-800 hover:border-red-600/50 hover:bg-zinc-900 transition-all duration-300 cursor-pointer overflow-hidden"
                            >
                                <CardContent className="p-0">
                                    <div className="relative aspect-square overflow-hidden">
                                        {author.coverImage ? (
                                            <>
                                                <img
                                                    src={author.coverImage}
                                                    alt={author.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                                            </>
                                        ) : (
                                            <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                                <UserRoundPen className="h-16 w-16 text-zinc-600" />
                                            </div>
                                        )}
                                        
                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="bg-red-600 rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                                <ArrowRight className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="p-4">
                                        <h3 className="font-semibold text-zinc-50 text-center line-clamp-2 group-hover:text-red-500 transition-colors duration-200">
                                            {author.name}
                                        </h3>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Empty State (when no authors) */}
                    {authors.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <UserRoundPen className="h-24 w-24 text-zinc-700 mb-4" />
                            <h2 className="text-2xl font-bold text-zinc-50 mb-2">No Authors Found</h2>
                            <p className="text-zinc-400">Check back later for featured authors</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}