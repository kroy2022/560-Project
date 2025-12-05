import { Link } from "react-router-dom"
import { BookOpen, Star, Users, TrendingUp, Search, Heart, Zap } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"

export function Landing() {
    return (
        <div className="min-h-screen bg-zinc-950">
            {/* Navbar */}
            <nav className="sticky border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
                <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <BookOpen className="h-7 w-7 text-red-600" />
                        <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                            BookFlix
                        </span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link to="/signin">
                            <Button variant="ghost" className="text-zinc-300 hover:text-zinc-50">
                                Sign In
                            </Button>
                        </Link>
                        <Link to="/signup">
                            <Button className="bg-red-600 hover:bg-red-700">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 to-transparent" />
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-32 relative">
                    <div className="text-center space-y-6 max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 border border-red-600/20 rounded-full text-red-500 text-sm font-medium mb-4">
                            <Zap className="h-4 w-4" />
                            Your Personal Library Awaits
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-zinc-50 leading-tight">
                            Discover Your Next
                            <span className="block bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                                Great Read
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto">
                            Browse thousands of books, read reviews, and create your personalized reading list all in one place.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Link to="/dashboard">
                                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-lg px-8 py-6">
                                    Start Reviewing
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-zinc-50 mb-4">
                            Everything You Need to Love Reading
                        </h2>
                        <p className="text-xl text-zinc-400">
                            A powerful platform designed for book lovers
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="bg-zinc-900/50 border-zinc-800 hover:border-red-600/50 transition-all duration-300">
                            <CardContent className="pt-6">
                                <div className="h-12 w-12 rounded-full bg-red-600/20 flex items-center justify-center mb-4">
                                    <Search className="h-6 w-6 text-red-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-zinc-50 mb-2">
                                    Smart Search
                                </h3>
                                <p className="text-zinc-400 leading-relaxed">
                                    Find exactly what you're looking for with our intelligent search across titles, authors, and genres.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-zinc-900/50 border-zinc-800 hover:border-red-600/50 transition-all duration-300">
                            <CardContent className="pt-6">
                                <div className="h-12 w-12 rounded-full bg-red-600/20 flex items-center justify-center mb-4">
                                    <Heart className="h-6 w-6 text-red-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-zinc-50 mb-2">
                                    Save Favorites
                                </h3>
                                <p className="text-zinc-400 leading-relaxed">
                                    Create your personal library by saving books you love and want to read later.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-zinc-900/50 border-zinc-800 hover:border-red-600/50 transition-all duration-300">
                            <CardContent className="pt-6">
                                <div className="h-12 w-12 rounded-full bg-red-600/20 flex items-center justify-center mb-4">
                                    <Star className="h-6 w-6 text-red-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-zinc-50 mb-2">
                                    Read Reviews
                                </h3>
                                <p className="text-zinc-400 leading-relaxed">
                                    See what other readers think and share your own thoughts with the community.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-zinc-900/50 border-zinc-800 hover:border-red-600/50 transition-all duration-300">
                            <CardContent className="pt-6">
                                <div className="h-12 w-12 rounded-full bg-red-600/20 flex items-center justify-center mb-4">
                                    <TrendingUp className="h-6 w-6 text-red-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-zinc-50 mb-2">
                                    Trending Books
                                </h3>
                                <p className="text-zinc-400 leading-relaxed">
                                    Stay updated with the most popular and highly-rated books in every genre.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-zinc-900/50 border-zinc-800 hover:border-red-600/50 transition-all duration-300">
                            <CardContent className="pt-6">
                                <div className="h-12 w-12 rounded-full bg-red-600/20 flex items-center justify-center mb-4">
                                    <Users className="h-6 w-6 text-red-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-zinc-50 mb-2">
                                    Author Profiles
                                </h3>
                                <p className="text-zinc-400 leading-relaxed">
                                    Explore detailed author pages and discover all their works in one place.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-zinc-900/50 border-zinc-800 hover:border-red-600/50 transition-all duration-300">
                            <CardContent className="pt-6">
                                <div className="h-12 w-12 rounded-full bg-red-600/20 flex items-center justify-center mb-4">
                                    <BookOpen className="h-6 w-6 text-red-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-zinc-50 mb-2">
                                    Genre Collections
                                </h3>
                                <p className="text-zinc-400 leading-relaxed">
                                    Browse curated collections organized by genre to find your next favorite book.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 md:px-8">
                <div className="max-w-4xl mx-auto">
                    <Card className="bg-gradient-to-br from-red-950/40 to-zinc-900 border-red-600/30">
                        <CardContent className="pt-12 pb-12 text-center">
                            <h2 className="text-3xl md:text-5xl font-bold text-zinc-50 mb-4">
                                Ready to Start Your Reading Journey?
                            </h2>
                            <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
                                Join thousands of readers who've already discovered their next favorite book.
                            </p>
                            <Link to="/signup">
                                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-lg px-8 py-6">
                                    Create Free Account
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-zinc-800 py-8 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-6 w-6 text-red-600" />
                            <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                                BookFlix
                            </span>
                        </div>
                        <p className="text-zinc-500 text-sm">
                            © 2025 BookFlix. 
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}