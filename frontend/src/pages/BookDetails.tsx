"use client"

import { useParams, Link } from "react-router-dom"
import { Star, Calendar, Tag, ArrowLeft } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { BookCard } from "../components/BookCard"
import { bookDetails, bookReviews, topReviewedBooks } from "../data/mockData"

export function BookDetails() {
  const { bookId } = useParams<{ bookId: string }>()
  const book = bookDetails[Number(bookId)]
  const reviews = bookReviews[Number(bookId)] || []
  const similarBooks = topReviewedBooks.slice(0, 6)

  if (!book) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-50 mb-2">Book Not Found</h1>
          <p className="text-zinc-400 mb-4">The book you're looking for doesn't exist.</p>
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length || 0

  return (
    <div className="min-h-screen bg-zinc-950 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-50 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="grid md:grid-cols-[300px,1fr] lg:grid-cols-[400px,1fr] gap-8 mb-12">
          <div>
            <img
              src={book.coverImage || "/placeholder.svg"}
              alt={book.title}
              className="w-full rounded-lg shadow-2xl"
            />
            <div className="mt-4 space-y-2">
              <Button className="w-full" size="lg">
                Read Now
              </Button>
              <Button className="w-full bg-transparent" variant="outline" size="lg">
                Add to Saved
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-zinc-50 mb-2 text-balance">{book.title}</h1>
              <p className="text-xl text-zinc-400 mb-4">by {book.author}</p>

              <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(book.publicationDate).getFullYear()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  <span>{book.genre}</span>
                </div>
                {reviews.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span>
                      {avgRating.toFixed(1)} ({reviews.length} reviews)
                    </span>
                  </div>
                )}
              </div>
            </div>

            <Tabs defaultValue="details" className="w-full">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-50 mb-2">Description</h3>
                  <p className="text-zinc-400 leading-relaxed">{book.description}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-50 mb-2">Details</h3>
                  <dl className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="text-zinc-500">ISBN</dt>
                      <dd className="text-zinc-300 mt-1">{book.isbn}</dd>
                    </div>
                    <div>
                      <dt className="text-zinc-500">Genre</dt>
                      <dd className="text-zinc-300 mt-1">{book.genre}</dd>
                    </div>
                    <div>
                      <dt className="text-zinc-500">Publication Date</dt>
                      <dd className="text-zinc-300 mt-1">{new Date(book.publicationDate).toLocaleDateString()}</dd>
                    </div>
                  </dl>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-zinc-400 text-center py-8">No reviews yet. Be the first to review this book!</p>
                ) : (
                  reviews.map((review) => (
                    <Card key={review.reviewId}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{review.userName}</CardTitle>
                            <p className="text-sm text-zinc-500 mt-1">
                              {new Date(review.reviewDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-zinc-700"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-zinc-300 leading-relaxed">{review.content}</p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-zinc-50">Similar Books</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {similarBooks.map((similarBook) => (
              <BookCard key={similarBook.bookId} book={similarBook} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
