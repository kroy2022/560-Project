export interface Book {
  bookId: number
  isbn: string
  title: string
  author: string
  coverImage: string
  publicationDate: string
  description: string
  genre: string
}

export interface BookSummary {
  bookId: number
  isbn: string
  title: string
  author: string
  coverImage: string
  genre: string
}

export interface PopularBook extends BookSummary {
  avgRating: number
  totalReviews: number
  popularityRank: number
}

export interface Review {
  reviewId: number
  userId: number
  userName: string
  rating: number
  content: string
  reviewDate: string
}

export interface GenreRow {
  genre: string
  genreId: number
  books: BookSummary[]
}
