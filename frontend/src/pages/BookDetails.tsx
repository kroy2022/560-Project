"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useSearchParams } from "react-router-dom"
import { Star, Calendar, Tag, ArrowLeft, Bookmark, BookmarkCheck } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { BookCard } from "../components/BookCard"
import { bookDetails, bookReviews, topReviewedBooks } from "../data/mockData"
import axios from "axios"
import { API_URL } from "../api/routes"
import { Label } from "../components/ui/label"
import LoadingScreen from "../components/LoadingScreen"
import { AuthValues, Book, PopularBook, Review} from "../types"
import { Navbar } from "../components/Navbar"

export function BookDetails({ user_id, user_name }: AuthValues) {
  const [searchParams] = useSearchParams();
  const bookId = searchParams.get("book_id");
  const openReview = searchParams.get("openReview");

  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [similarBooks, setSimilarBooks] = useState<PopularBook[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSavingBook, setIsSavingBook] = useState(false);
  const [reviewRating, setReviewRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [reviewContent, setReviewContent] = useState("")
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [activeTab, setActiveTab] = useState(openReview ? "reviews" : "details");

  // get book info first, then reviews, then similar books
  useEffect(() => {
    const getBookData = async () => {
      await getBookInfo();
    }

    getBookData();
  }, [bookId])

  const getBookInfo = async () => {
    try {
      const response = await axios.get(`${API_URL}/book/info?bookId=${bookId}&userId=${user_id}`);
      console.log("BOOK INFO RESPONSE: ", response);
      setBook(response.data.book);
      setIsLoading(false);
      await getBookReviews();
      await getSimilarBooks(response.data.book.genre, response.data.book.author);
    } catch (error) {
      console.error("Error in getBookInfo: ", error);
    }
  }

  const getBookReviews = async () => {
    try {
      const response = await axios.get(`${API_URL}/book/reviews?bookId=${bookId}`);
      console.log("REVIEWS RESPONSE: ", response);
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error("Error in getSimilarBooks: ", error);
    }
  }

  // get 10 random books => 5 same author, 5 same genre
  const getSimilarBooks = async (genre: string, author: string) => {
    try {
      const response = await axios.get(`${API_URL}/book/similar-books?genre=${genre}&author=${author}&bookId=${bookId}`);
      console.log("SIMILAR BOOKS RESPONSE: ", response);
      setSimilarBooks(response.data.books || []);
    } catch (error) {
      console.error("Error in getSimilarBooks: ", error);
    }
  }

  // Below functions are for updates / inserts into DB

  const changeSavedStatus = async () => {
    setIsSavingBook(true);
    try {
      console.log("IS CURRENTLY SAVED THATS CHANGING: ", book?.isSaved);
      const response = await axios.post(`${API_URL}/book/save`, {
          userId: user_id,
          bookId: bookId,
          isCurrentlySaved: book?.isSaved
      })

      console.log("CHANGE SAVE STATUS RESPONSE: ", response);

      if (response.status == 200) {
        setBook({
          ...book!, 
          isSaved: Number(!book!.isSaved)
        });
      } else {
        alert("Something went wrong when saving book");
        console.error("ERROR SAVING BOOK: ", response);
      }
    } catch (error) {
      console.error("ERROR IN changeSavedStatus: ", error);
      alert("Failed to update saved status. Please try again.");
    } finally {
      setIsSavingBook(false);
    }
  }

  const addReviewToBook = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (reviewRating === 0) {
      alert("Please select a rating")
      return
    }
    
    if (reviewContent.trim().length < 10) {
      alert("Please write a review with at least 10 characters")
      return
    }
    
    setIsSubmittingReview(true)
    
    try {
      const response = await axios.post(`${API_URL}/book/review/create`, {
        bookId: bookId,
        userId: user_id,
        rating: reviewRating,
        content: reviewContent
      })
      
      setActiveTab("details");
      const today = new Date();          
      const reviewDateString = today.toISOString();
      
      // Increase review array
      const newReview = {
        reviewId: response.data.reviewId,
        userId: user_id,
        userName: user_name,
        rating: reviewRating,
        content: reviewContent,
        reviewDate: reviewDateString
      }
      setReviews([...reviews, newReview])
            
      // Reset form
      setReviewRating(0)
      setReviewContent("")
      
    } catch (error) {
      console.error("Error submitting review:", error)
      alert("Failed to submit review. Please try again.")
    } finally {
      setIsSubmittingReview(false)
    }
  }

  if (isLoading) {
    <LoadingScreen />
  }

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

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const hasWrittenReview = reviews.some((review) => review.userId == user_id!);

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar showSearchBar={false} />
      <div className="min-h-screen bg-zinc-950 py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-[300px,1fr] lg:grid-cols-[400px,1fr] gap-8 mb-12">
            <div>
              <img
                src={
                  book.coverImage
                    ? (book.coverImage === "bad" ? "/default.png" : book.coverImage)
                    : "/default.png"
                }
                alt={book.title}
                className="w-full rounded-lg shadow-2xl"
              />
              <div className="mt-4 space-y-2">
                {book.isSaved ? (
                  <Button 
                    className="w-full bg-green-600/20 border-green-600 text-green-500 hover:bg-green-600/30 hover:text-green-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                    variant="outline" 
                    size="lg" 
                    onClick={() => changeSavedStatus()}
                    disabled={isSavingBook}
                  >
                    <BookmarkCheck className={`h-5 w-5 mr-2 ${isSavingBook ? 'animate-pulse' : ''}`} />
                    {isSavingBook ? 'Updating...' : 'Saved'}
                  </Button>
                ) : (
                  <Button 
                    className="w-full bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:border-green-600 hover:text-green-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                    variant="outline" 
                    size="lg" 
                    onClick={() => changeSavedStatus()}
                    disabled={isSavingBook}
                  >
                    <Bookmark className={`h-5 w-5 mr-2 ${isSavingBook ? 'animate-pulse' : ''}`} />
                    {isSavingBook ? 'Saving...' : 'Add to Saved'}
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-zinc-50 mb-2 text-balance">{book.title}</h1>
                <p className="text-xl text-zinc-400 mb-4">by {book.author}</p>

                <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{book.publicationDate?.substring(0, 4) || "No Date Available"}</span>
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

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  {!hasWrittenReview && (<TabsTrigger value="reviews">Write a Review</TabsTrigger>)}
                </TabsList>

                <TabsContent value="details" className="space-y-4 mt-5">
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
                        <dd className="text-zinc-300 mt-1">{book.publicationDate?.substring(0, 10) || "No Date Available"}</dd>
                      </div>
                      <div>
                        <dt className="text-zinc-500">Publisher</dt>
                        <dd className="text-zinc-300 mt-1">{book.publisher || "No Publisher Available"}</dd>
                      </div>
                    </dl>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-6 mt-5">
                  {/* Write a Review Form */}
                  {!hasWrittenReview ? (
                    <Card className="bg-zinc-900/50 border-zinc-800">
                      <CardHeader>
                        <CardTitle className="text-xl">Write a Review</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={addReviewToBook} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="rating" className="text-zinc-200">
                              Your Rating
                            </Label>
                            <div className="flex items-center gap-2">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => setReviewRating(i + 1)}
                                  onMouseEnter={() => setHoveredRating(i + 1)}
                                  onMouseLeave={() => setHoveredRating(0)}
                                  className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-600 rounded"
                                >
                                  <Star
                                    className={`h-8 w-8 ${
                                      i < (hoveredRating || reviewRating)
                                        ? "fill-yellow-500 text-yellow-500"
                                        : "text-zinc-700"
                                    }`}
                                  />
                                </button>
                              ))}
                              {reviewRating > 0 && (
                                <span className="text-zinc-400 ml-2">{reviewRating} / 5</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="review" className="text-zinc-200">
                              Your Review
                            </Label>
                            <textarea
                              id="review"
                              placeholder="Share your thoughts about this book..."
                              value={reviewContent}
                              onChange={(e) => setReviewContent(e.target.value)}
                              rows={4}
                              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-md text-zinc-50 placeholder:text-zinc-500 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none resize-none"
                              required
                            />
                            <p className="text-xs text-zinc-500">
                              {reviewContent.length} characters (minimum 10)
                            </p>
                          </div>
                          
                          <Button 
                            type="submit" 
                            className="w-full bg-red-600 hover:bg-red-700"
                            disabled={isSubmittingReview}
                          >
                            {isSubmittingReview ? "Submitting..." : "Submit Review"}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-zinc-900/50 border-zinc-800">
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <div className="bg-green-600/20 rounded-full p-4 mb-4">
                            <Star className="h-8 w-8 text-green-500 fill-green-500" />
                          </div>
                          <h3 className="text-xl font-semibold text-zinc-50 mb-2">Review Already Submitted</h3>
                          <p className="text-zinc-400 max-w-md">
                            You've already written a review for this book. 
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-50">Similar Books</h2>
            {similarBooks.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {similarBooks.map((similarBook) => (
                  <BookCard key={similarBook.bookId} book={similarBook}/>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 bg-zinc-900 rounded-lg border border-zinc-800">
                <p className="text-zinc-400 text-center">
                  No similar books found for {book.title ?? "this title"}
                </p>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-zinc-50 mb-3 mt-10">
              All Reviews ({reviews.length})
            </h3>
            <div className="space-y-4 pr-2">
              {reviews.length === 0 ? (
                <p className="text-zinc-400 text-center py-8">No reviews yet. Be the first to review this book!</p>
              ) : (
                reviews.map((review) => {
                  const isCurrentUserReview = review.userName === user_name;
                  return (
                    <Card 
                      key={review.reviewId} 
                      className={`${
                        isCurrentUserReview 
                          ? 'bg-green-950/30 border-green-600/50 ring-1 ring-green-600/30' 
                          : 'bg-zinc-900/50 border-zinc-800'
                      } transition-all duration-200`}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <CardTitle className={`text-lg ${isCurrentUserReview ? 'text-green-400' : ''}`}>
                                {review.userName}
                              </CardTitle>
                              {isCurrentUserReview && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-600/20 text-green-400 border border-green-600/50">
                                  Your Review
                                </span>
                              )}
                            </div>
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
                        <p className={`leading-relaxed ${isCurrentUserReview ? 'text-zinc-200' : 'text-zinc-300'}`}>
                          {review.content}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
